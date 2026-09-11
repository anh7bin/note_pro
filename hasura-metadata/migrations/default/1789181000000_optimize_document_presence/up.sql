CREATE INDEX document_presence_last_seen_idx
  ON public.document_presence (last_seen);

CREATE OR REPLACE FUNCTION public.cleanup_stale_document_presence()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.document_presence
  WHERE last_seen < now() - interval '10 minutes';

  RETURN NULL;
END;
$$;
