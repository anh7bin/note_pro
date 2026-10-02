CREATE OR REPLACE FUNCTION public.search_invitee(
  document_id UUID,
  search_email TEXT,
  hasura_session JSON
)
RETURNS SETOF public.invitee_search_results
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
  SELECT
    user_record.id,
    user_record.email,
    user_record.name,
    user_record.avatar_url
  FROM public.users AS user_record
  WHERE
    LENGTH(BTRIM($2)) <= 254
    AND BTRIM($2) ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    AND LOWER(user_record.email) = LOWER(BTRIM($2))
    AND EXISTS (
      SELECT 1
      FROM public.blocks AS document
      WHERE
        document.id = $1
        AND document.type = 'page'
        AND document.deleted_at IS NULL
        AND document.user_id = NULLIF(
          $3 ->> 'x-hasura-user-id',
          ''
        )::UUID
    )
  ORDER BY user_record.id
  LIMIT 1;
$function$;

DROP TABLE IF EXISTS public.invitee_search_rate_limits;
