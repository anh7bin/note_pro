DROP TRIGGER IF EXISTS set_block_document_workspace_before_write
  ON public.blocks;

DROP FUNCTION IF EXISTS public.set_block_document_workspace();
