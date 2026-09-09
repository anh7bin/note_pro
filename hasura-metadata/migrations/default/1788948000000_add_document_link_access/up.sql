CREATE TABLE public.document_link_access (
  document_id UUID PRIMARY KEY REFERENCES public.blocks(id) ON DELETE CASCADE,
  permission_type TEXT NOT NULL DEFAULT 'restricted'
    CHECK (permission_type IN ('restricted', 'read', 'write')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.document_link_access IS
  'Controls access granted to authenticated users who have a document link.';

COMMENT ON COLUMN public.document_link_access.permission_type IS
  'restricted, read, or write';
