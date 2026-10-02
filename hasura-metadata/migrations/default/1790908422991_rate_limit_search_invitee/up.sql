CREATE TABLE public.invitee_search_rate_limits (
  user_id UUID PRIMARY KEY,
  request_count INTEGER NOT NULL,
  reset_at TIMESTAMPTZ NOT NULL
);

CREATE OR REPLACE FUNCTION public.search_invitee(
  document_id UUID,
  search_email TEXT,
  hasura_session JSON
)
RETURNS SETOF public.invitee_search_results
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  requester_id UUID;
  current_request_count INTEGER;
BEGIN
  requester_id := NULLIF(
    hasura_session ->> 'x-hasura-user-id',
    ''
  )::UUID;

  IF requester_id IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.blocks AS document
    WHERE
      document.id = document_id
      AND document.type = 'page'
      AND document.deleted_at IS NULL
      AND document.user_id = requester_id
  ) THEN
    RETURN;
  END IF;

  INSERT INTO public.invitee_search_rate_limits (
    user_id,
    request_count,
    reset_at
  )
  VALUES (
    requester_id,
    1,
    NOW() + INTERVAL '1 minute'
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    request_count = CASE
      WHEN invitee_search_rate_limits.reset_at <= NOW() THEN 1
      ELSE invitee_search_rate_limits.request_count + 1
    END,
    reset_at = CASE
      WHEN invitee_search_rate_limits.reset_at <= NOW()
        THEN NOW() + INTERVAL '1 minute'
      ELSE invitee_search_rate_limits.reset_at
    END
  RETURNING request_count INTO current_request_count;

  IF current_request_count > 30 THEN
    RAISE EXCEPTION 'Too many invite searches'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN QUERY
  SELECT
    user_record.id,
    user_record.email,
    user_record.name,
    user_record.avatar_url
  FROM public.users AS user_record
  WHERE
    LENGTH(BTRIM(search_email)) <= 254
    AND BTRIM(search_email) ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    AND LOWER(user_record.email) = LOWER(BTRIM(search_email))
  ORDER BY user_record.id
  LIMIT 1;
END;
$function$;
