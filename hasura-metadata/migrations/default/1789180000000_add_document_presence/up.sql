CREATE TABLE public.document_presence (
  session_id UUID PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.blocks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX document_presence_document_id_last_seen_idx
  ON public.document_presence (document_id, last_seen DESC);

CREATE INDEX document_presence_user_id_idx
  ON public.document_presence (user_id);

-- Closed browsers cannot reliably send a final request. Remove abandoned
-- sessions whenever a new editor session starts so the table stays bounded.
CREATE FUNCTION public.cleanup_stale_document_presence()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.document_presence
  WHERE last_seen < now() - interval '24 hours';

  RETURN NULL;
END;
$$;

CREATE TRIGGER cleanup_stale_document_presence_after_insert
AFTER INSERT ON public.document_presence
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_stale_document_presence();
