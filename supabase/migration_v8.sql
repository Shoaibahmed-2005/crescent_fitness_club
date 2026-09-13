CREATE OR REPLACE FUNCTION delete_registration_admin(reg_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    -- Check if the current user is an admin
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'ADMIN'
    ) INTO is_admin;

    IF NOT is_admin THEN
        RAISE EXCEPTION 'Unauthorized. Only admins can delete registrations.';
    END IF;

    -- Delete the registration
    DELETE FROM registrations WHERE id = reg_id;
    
    RETURN true;
END;
$$;
