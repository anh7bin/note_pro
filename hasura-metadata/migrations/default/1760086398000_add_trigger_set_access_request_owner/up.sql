-- Add trigger function to automatically set owner_id from document's user_id
CREATE OR REPLACE FUNCTION set_access_request_owner()
RETURNS TRIGGER AS $$
BEGIN
  -- If owner_id is not provided, get it from the document's user_id
  IF NEW.owner_id IS NULL THEN
    SELECT user_id INTO NEW.owner_id
    FROM blocks
    WHERE id = NEW.document_id AND type = 'page';
    
    -- If owner_id is still NULL, raise an error
    IF NEW.owner_id IS NULL THEN
      RAISE EXCEPTION 'Cannot find owner for document_id: %', NEW.document_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that runs before insert
CREATE TRIGGER set_owner_before_insert
BEFORE INSERT ON access_requests
FOR EACH ROW
EXECUTE FUNCTION set_access_request_owner();

