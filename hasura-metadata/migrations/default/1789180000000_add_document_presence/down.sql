DROP TRIGGER IF EXISTS cleanup_stale_document_presence_after_insert
  ON public.document_presence;
DROP FUNCTION IF EXISTS public.cleanup_stale_document_presence();
DROP TABLE IF EXISTS public.document_presence;
