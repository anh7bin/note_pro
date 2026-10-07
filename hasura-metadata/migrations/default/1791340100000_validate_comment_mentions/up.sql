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
    SELECT DISTINCT mention.id
    FROM unnest(NEW.mentioned_user_ids) AS mention(id)
    JOIN public.users AS mentioned_user ON mentioned_user.id = mention.id
    WHERE strpos(
      NEW.content,
      '@' || COALESCE(
        NULLIF(BTRIM(mentioned_user.name), ''),
        mentioned_user.email
      )
    ) > 0
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
