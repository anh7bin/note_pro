DROP INDEX IF EXISTS public.idx_blocks_deleted_documents;

ALTER TABLE public.blocks
ALTER COLUMN deleted_at TYPE timetz
USING deleted_at::timetz;
