DROP TRIGGER IF EXISTS notify_mentions_after_comment_insert
ON public.block_comments;

DROP TRIGGER IF EXISTS notify_mentions_after_block_content_change
ON public.blocks;

DROP FUNCTION IF EXISTS public.notify_comment_mentions();
DROP FUNCTION IF EXISTS public.notify_block_mentions();
DROP FUNCTION IF EXISTS public.create_mention_notification(
  UUID,
  UUID,
  UUID,
  UUID,
  UUID,
  TEXT,
  TEXT
);
DROP FUNCTION IF EXISTS public.get_document_mention_users(UUID, JSON);

ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_type_check;

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

ALTER TABLE public.block_comments
DROP CONSTRAINT IF EXISTS block_comments_mentioned_user_ids_limit;

ALTER TABLE public.block_comments
DROP COLUMN IF EXISTS mentioned_user_ids;
