-- Drop trigger and function
DROP TRIGGER IF EXISTS set_owner_before_insert ON access_requests;
DROP FUNCTION IF EXISTS set_access_request_owner();

