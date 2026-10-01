-- deleted_at was originally created as timetz, which discarded the calendar
-- date. Preserve legacy values as today's local date and store all future
-- deletions as full timestamps.
ALTER TABLE public.blocks
ALTER COLUMN deleted_at TYPE timestamptz
USING (
  CASE
    WHEN deleted_at IS NULL THEN NULL
    ELSE (CURRENT_DATE + deleted_at::time) AT TIME ZONE current_setting('TIMEZONE')
  END
);

CREATE INDEX IF NOT EXISTS idx_blocks_deleted_documents
ON public.blocks (workspace_id, deleted_at DESC)
WHERE type = 'page' AND deleted_at IS NOT NULL;
