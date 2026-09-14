-- A document's child blocks must stay in the document owner's workspace.
-- Otherwise workspace-based select permissions can make collaborator-created
-- blocks invisible to the document owner.
UPDATE public.blocks AS child
SET workspace_id = page.workspace_id
FROM public.blocks AS page
WHERE child.page_id = page.id
  AND child.workspace_id IS DISTINCT FROM page.workspace_id;

CREATE OR REPLACE FUNCTION public.set_block_document_workspace()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.page_id IS NOT NULL THEN
    SELECT workspace_id
    INTO NEW.workspace_id
    FROM public.blocks
    WHERE id = NEW.page_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_block_document_workspace_before_write
  BEFORE INSERT OR UPDATE OF page_id, workspace_id ON public.blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_block_document_workspace();
