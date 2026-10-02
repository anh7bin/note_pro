DROP FUNCTION IF EXISTS public.search_invitee(UUID, TEXT, JSON);

DROP INDEX IF EXISTS public.idx_users_email_lower;

DROP TABLE IF EXISTS public.invitee_search_results;
