DROP TRIGGER IF EXISTS create_notification_after_access_request_change
ON public.access_requests;

DROP FUNCTION IF EXISTS public.create_access_request_notification();

-- Restore the previous behavior for a rollback.
CREATE OR REPLACE FUNCTION public.set_access_request_owner()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    SELECT user_id INTO NEW.owner_id
    FROM public.blocks
    WHERE id = NEW.document_id AND type = 'page';

    IF NEW.owner_id IS NULL THEN
      RAISE EXCEPTION 'Cannot find owner for document_id: %', NEW.document_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE public.access_requests
DROP CONSTRAINT IF EXISTS access_requests_status_check;

ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_type_check;

DROP INDEX IF EXISTS public.idx_notifications_user_unread_created_at;
DROP INDEX IF EXISTS public.idx_notifications_user_created_at;
DROP INDEX IF EXISTS public.idx_notifications_event_key;

CREATE INDEX IF NOT EXISTS idx_notifications_user_id
ON public.notifications (user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read
ON public.notifications (is_read);

ALTER TABLE public.notifications
DROP COLUMN IF EXISTS event_key;
