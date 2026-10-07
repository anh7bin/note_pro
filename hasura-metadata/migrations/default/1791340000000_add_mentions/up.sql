ALTER TABLE public.block_comments
ADD COLUMN mentioned_user_ids UUID[] NOT NULL DEFAULT ARRAY[]::UUID[];

ALTER TABLE public.block_comments
ADD CONSTRAINT block_comments_mentioned_user_ids_limit
CHECK (cardinality(mentioned_user_ids) <= 50);

ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE public.notifications
ADD CONSTRAINT notifications_type_check
CHECK (
  type IN (
    'access_request',
    'access_granted',
    'access_denied',
    'access_permission_updated',
    'mention'
  )
) NOT VALID;

CREATE OR REPLACE FUNCTION public.get_document_mention_users(
  document_id UUID,
  hasura_session JSON
)
RETURNS SETOF public.invitee_search_results
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
  WITH requested_document AS (
    SELECT document.id, document.user_id
    FROM public.blocks AS document
    WHERE
      document.id = $1
      AND document.type = 'page'
      AND document.deleted_at IS NULL
      AND (
        document.user_id = NULLIF(
          $2 ->> 'x-hasura-user-id',
          ''
        )::UUID
        OR EXISTS (
          SELECT 1
          FROM public.access_requests AS caller_access
          WHERE
            caller_access.document_id = document.id
            AND caller_access.requester_id = NULLIF(
              $2 ->> 'x-hasura-user-id',
              ''
            )::UUID
            AND caller_access.status = 'approved'
        )
      )
  ), mentionable_user_ids AS (
    SELECT requested_document.user_id AS user_id
    FROM requested_document
    UNION
    SELECT access.requester_id
    FROM public.access_requests AS access
    JOIN requested_document
      ON requested_document.id = access.document_id
    WHERE access.status = 'approved'
  )
  SELECT user_record.id, user_record.email, user_record.name, user_record.avatar_url
  FROM public.users AS user_record
  JOIN mentionable_user_ids ON mentionable_user_ids.user_id = user_record.id
  ORDER BY LOWER(COALESCE(NULLIF(user_record.name, ''), user_record.email));
$function$;

CREATE OR REPLACE FUNCTION public.create_mention_notification(
  recipient_id UUID,
  actor_id UUID,
  document_id UUID,
  block_id UUID,
  comment_id UUID,
  event_key TEXT,
  source_type TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  document_title TEXT;
  document_workspace_id UUID;
  actor_name TEXT;
  actor_email TEXT;
  actor_avatar TEXT;
BEGIN
  IF $1 IS NULL OR $1 = $2 THEN
    RETURN;
  END IF;

  SELECT
    regexp_replace(
      COALESCE(NULLIF(content ->> 'title', ''), 'Untitled Document'),
      '<[^>]*>',
      '',
      'g'
    ),
    workspace_id
  INTO document_title, document_workspace_id
  FROM public.blocks
  WHERE id = $3 AND type = 'page' AND deleted_at IS NULL;

  IF document_workspace_id IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.blocks AS document
    WHERE
      document.id = $3
      AND (
        document.user_id = $1
        OR EXISTS (
          SELECT 1
          FROM public.access_requests AS recipient_access
          WHERE
            recipient_access.document_id = document.id
            AND recipient_access.requester_id = $1
            AND recipient_access.status = 'approved'
        )
      )
  ) THEN
    RETURN;
  END IF;

  SELECT name, email, avatar_url
  INTO actor_name, actor_email, actor_avatar
  FROM public.users
  WHERE id = $2;

  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    data,
    event_key
  ) VALUES (
    $1,
    'mention',
    document_title,
    format(
      '%s mentioned you %s',
      COALESCE(NULLIF(actor_name, ''), actor_email, 'Someone'),
      CASE
        WHEN $7 = 'comment' THEN 'in a comment'
        ELSE 'in a document'
      END
    ),
    jsonb_build_object(
      'document_id', $3,
      'workspace_id', document_workspace_id,
      'document_title', document_title,
      'block_id', $4,
      'comment_id', $5,
      'source_type', $7,
      'actor_id', $2,
      'actor_name', actor_name,
      'actor_email', actor_email,
      'actor_avatar', actor_avatar
    ),
    $6
  )
  ON CONFLICT DO NOTHING;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_block_mentions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  mentioned_user_id UUID;
  document_id UUID;
  actor_id UUID;
  previous_text TEXT := '';
  next_text TEXT := COALESCE(NEW.content ->> 'text', '');
  session_data JSON;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    previous_text := COALESCE(OLD.content ->> 'text', '');
    IF previous_text = next_text THEN
      RETURN NEW;
    END IF;
  END IF;

  document_id := CASE WHEN NEW.type = 'page' THEN NEW.id ELSE NEW.page_id END;
  IF document_id IS NULL THEN
    RETURN NEW;
  END IF;

  BEGIN
    session_data := NULLIF(current_setting('hasura.user', TRUE), '')::JSON;
    actor_id := NULLIF(session_data ->> 'x-hasura-user-id', '')::UUID;
  EXCEPTION WHEN OTHERS THEN
    actor_id := NULL;
  END;
  actor_id := COALESCE(actor_id, NEW.user_id);

  FOR mentioned_user_id IN
    SELECT DISTINCT (match)[1]::UUID
    FROM regexp_matches(
      next_text,
      'data-id=["'']([0-9a-fA-F-]{36})["'']',
      'g'
    ) AS match
    EXCEPT
    SELECT DISTINCT (match)[1]::UUID
    FROM regexp_matches(
      previous_text,
      'data-id=["'']([0-9a-fA-F-]{36})["'']',
      'g'
    ) AS match
  LOOP
    PERFORM public.create_mention_notification(
      mentioned_user_id,
      actor_id,
      document_id,
      NEW.id,
      NULL,
      format(
        'mention:block:%s:%s:%s',
        NEW.id,
        mentioned_user_id,
        md5(next_text)
      ),
      'block'
    );
  END LOOP;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_comment_mentions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  mentioned_user_id UUID;
  document_id UUID;
BEGIN
  SELECT CASE WHEN block.type = 'page' THEN block.id ELSE block.page_id END
  INTO document_id
  FROM public.blocks AS block
  WHERE block.id = NEW.block_id;

  IF document_id IS NULL THEN
    RETURN NEW;
  END IF;

  FOR mentioned_user_id IN
    SELECT DISTINCT unnest(NEW.mentioned_user_ids)
  LOOP
    PERFORM public.create_mention_notification(
      mentioned_user_id,
      NEW.user_id,
      document_id,
      NEW.block_id,
      NEW.id,
      format('mention:comment:%s:%s', NEW.id, mentioned_user_id),
      'comment'
    );
  END LOOP;

  RETURN NEW;
END;
$function$;

CREATE TRIGGER notify_mentions_after_block_content_change
AFTER INSERT OR UPDATE OF content ON public.blocks
FOR EACH ROW
EXECUTE FUNCTION public.notify_block_mentions();

CREATE TRIGGER notify_mentions_after_comment_insert
AFTER INSERT ON public.block_comments
FOR EACH ROW
EXECUTE FUNCTION public.notify_comment_mentions();
