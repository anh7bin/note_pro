-- Notifications are domain events. They must be produced by the database in the
-- same transaction as the access request change, never by an untrusted client.

ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS event_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_notifications_event_key
ON public.notifications (event_key)
WHERE event_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_user_created_at
ON public.notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread_created_at
ON public.notifications (user_id, created_at DESC)
WHERE is_read = FALSE;

DROP INDEX IF EXISTS public.idx_notifications_user_id;
DROP INDEX IF EXISTS public.idx_notifications_is_read;

ALTER TABLE public.notifications
ADD CONSTRAINT notifications_type_check
CHECK (
  type IN (
    'access_request',
    'access_granted',
    'access_denied',
    'access_permission_updated'
  )
) NOT VALID;

ALTER TABLE public.access_requests
ADD CONSTRAINT access_requests_status_check
CHECK (status IN ('pending', 'approved', 'rejected')) NOT VALID;

-- Always derive the owner from the document. A supplied owner_id is treated as
-- untrusted input and is overwritten before permission checks are persisted.
CREATE OR REPLACE FUNCTION public.set_access_request_owner()
RETURNS TRIGGER AS $$
BEGIN
  SELECT user_id INTO NEW.owner_id
  FROM public.blocks
  WHERE id = NEW.document_id AND type = 'page';

  IF NEW.owner_id IS NULL THEN
    RAISE EXCEPTION 'Cannot find owner for document_id: %', NEW.document_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.create_access_request_notification()
RETURNS TRIGGER AS $$
DECLARE
  notification_type TEXT;
  notification_title TEXT;
  notification_message TEXT;
  recipient_id UUID;
  document_title TEXT;
  document_workspace_id UUID;
  requester_name TEXT;
  requester_email TEXT;
  requester_avatar TEXT;
  owner_name TEXT;
  owner_email TEXT;
  owner_avatar TEXT;
  permission_label TEXT;
BEGIN
  -- Ignore updates that cannot change the meaning of a notification.
  IF TG_OP = 'UPDATE'
     AND OLD.status IS NOT DISTINCT FROM NEW.status
     AND OLD.permission_type IS NOT DISTINCT FROM NEW.permission_type THEN
    RETURN NEW;
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
  WHERE id = NEW.document_id AND type = 'page';

  SELECT name, email, avatar_url
  INTO requester_name, requester_email, requester_avatar
  FROM public.users
  WHERE id = NEW.requester_id;

  SELECT name, email, avatar_url
  INTO owner_name, owner_email, owner_avatar
  FROM public.users
  WHERE id = NEW.owner_id;

  permission_label := CASE
    WHEN NEW.permission_type = 'write' THEN 'editor'
    ELSE 'viewer'
  END;

  IF NEW.status = 'pending' THEN
    recipient_id := NEW.owner_id;
    notification_type := 'access_request';
    notification_title := document_title;
    notification_message := format(
      '%s wants to %s this document',
      COALESCE(NULLIF(requester_name, ''), requester_email, 'Someone'),
      CASE WHEN NEW.permission_type = 'write' THEN 'edit' ELSE 'view' END
    );
  ELSIF NEW.status = 'rejected' THEN
    recipient_id := NEW.requester_id;
    notification_type := 'access_denied';
    notification_title := document_title;
    notification_message := 'Your request to access this document was declined';
  ELSIF NEW.status = 'approved'
        AND TG_OP = 'UPDATE'
        AND OLD.status = 'approved'
        AND OLD.permission_type IS DISTINCT FROM NEW.permission_type THEN
    recipient_id := NEW.requester_id;
    notification_type := 'access_permission_updated';
    notification_title := document_title;
    notification_message := format(
      '%s changed your access to %s',
      COALESCE(NULLIF(owner_name, ''), owner_email, 'The owner'),
      permission_label
    );
  ELSIF NEW.status = 'approved' THEN
    recipient_id := NEW.requester_id;
    notification_type := 'access_granted';
    notification_title := document_title;
    notification_message := format(
      '%s made you a %s of this document',
      COALESCE(NULLIF(owner_name, ''), owner_email, 'The owner'),
      permission_label
    );
  ELSE
    RETURN NEW;
  END IF;

  -- Do not notify a document owner about an action they performed on themselves.
  IF recipient_id IS NULL OR recipient_id = (
    CASE
      WHEN notification_type = 'access_request' THEN NEW.requester_id
      ELSE NEW.owner_id
    END
  ) THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    data,
    event_key
  ) VALUES (
    recipient_id,
    notification_type,
    document_title,
    notification_message,
    jsonb_build_object(
      'request_id', NEW.id,
      'document_id', NEW.document_id,
      'workspace_id', document_workspace_id,
      'document_title', document_title,
      'permission_type', NEW.permission_type,
      'requester_id', NEW.requester_id,
      'requester_email', requester_email,
      'requester_name', requester_name,
      'requester_avatar', requester_avatar,
      'owner_id', NEW.owner_id,
      'owner_email', owner_email,
      'owner_name', owner_name,
      'owner_avatar', owner_avatar
    ),
    format(
      'access_request:%s:%s:%s:%s',
      NEW.id,
      notification_type,
      NEW.permission_type,
      extract(epoch FROM COALESCE(NEW.updated_at, NEW.created_at))
    )
  )
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_notification_after_access_request_change
ON public.access_requests;

CREATE TRIGGER create_notification_after_access_request_change
AFTER INSERT OR UPDATE ON public.access_requests
FOR EACH ROW
EXECUTE FUNCTION public.create_access_request_notification();
