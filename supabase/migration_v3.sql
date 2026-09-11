-- Update the Registration RPC function to make gender optional
CREATE OR REPLACE FUNCTION process_registration(
    p_name TEXT,
    p_email TEXT,
    p_gender TEXT,
    p_phone TEXT,
    p_reg_number TEXT,
    p_department TEXT,
    p_year TEXT,
    p_sub_event_id UUID
) RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_profile_id UUID;
    v_event_id UUID;
    v_gender_restriction TEXT;
    v_deadline TIMESTAMP WITH TIME ZONE;
    v_is_active BOOLEAN;
    v_max_capacity INT;
    v_current_registrations INT;
    v_registration_id UUID;
    v_friendly_id TEXT;
    v_existing_email TEXT;
    v_existing_name TEXT;
    v_existing_reg_number TEXT;
BEGIN
    -- Trim email to ensure no whitespace mismatch
    p_email := LOWER(TRIM(p_email));

    -- 1. Retrieve Sub-Event & Event details
    SELECT se.event_id, se.gender_restriction, se.max_capacity,
           e.registration_deadline, e.is_active
    INTO v_event_id, v_gender_restriction, v_max_capacity, v_deadline, v_is_active
    FROM sub_events se
    JOIN events e ON se.event_id = e.id
    WHERE se.id = p_sub_event_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Sub-event not found.';
    END IF;

    -- 2. Validate Event active & Deadline
    IF NOT v_is_active THEN
        RAISE EXCEPTION 'This event is currently inactive.';
    END IF;

    IF v_deadline IS NOT NULL AND v_deadline < NOW() THEN
        RAISE EXCEPTION 'Registration deadline has passed.';
    END IF;

    -- 3. Validate Gender Eligibility (Bypassed if gender is missing, as requested)
    IF p_gender IS NOT NULL AND TRIM(p_gender) != '' THEN
        IF v_gender_restriction = 'MALE_ONLY' AND p_gender != 'MALE' THEN
            RAISE EXCEPTION 'This event is restricted to male participants only.';
        END IF;
        
        IF v_gender_restriction = 'FEMALE_ONLY' AND p_gender != 'FEMALE' THEN
            RAISE EXCEPTION 'This event is restricted to female participants only.';
        END IF;
    END IF;

    -- 4. Validate Capacity
    SELECT COUNT(*) INTO v_current_registrations
    FROM registrations
    WHERE sub_event_id = p_sub_event_id;

    IF v_current_registrations >= v_max_capacity THEN
        RAISE EXCEPTION 'This sub-event has reached its maximum capacity.';
    END IF;

    -- 5. Find or Create Profile (Email is case-insensitive unique key)
    SELECT id, name, registration_number INTO v_profile_id, v_existing_name, v_existing_reg_number
    FROM profiles
    WHERE LOWER(TRIM(email)) = p_email;

    IF FOUND THEN
        -- We just use the existing profile ID, and update department/year just in case
        p_name := v_existing_name;
        p_reg_number := v_existing_reg_number;
        
        IF p_department IS NOT NULL THEN
            UPDATE profiles SET department = p_department WHERE id = v_profile_id;
        END IF;
        IF p_year IS NOT NULL THEN
            UPDATE profiles SET year = p_year WHERE id = v_profile_id;
        END IF;
    ELSE
        -- Generate a new profile ID and insert
        v_profile_id := gen_random_uuid();
        INSERT INTO profiles (id, name, email, gender, phone, registration_number, department, year, role)
        VALUES (v_profile_id, p_name, p_email, p_gender, p_phone, p_reg_number, p_department, p_year, 'STUDENT');
    END IF;

    -- 6. Check for duplicate registration
    IF EXISTS (
        SELECT 1 FROM registrations 
        WHERE sub_event_id = p_sub_event_id AND user_id = v_profile_id
    ) THEN
        RAISE EXCEPTION 'You are already registered for this sub-event.';
    END IF;

    -- 7. Insert the Registration
    INSERT INTO registrations (sub_event_id, user_id, status)
    VALUES (p_sub_event_id, v_profile_id, 'CONFIRMED')
    RETURNING id INTO v_registration_id;

    -- Generate a friendly ID (e.g. CFC-2026-4827) based on a random 4 digit number
    v_friendly_id := 'CFC-2026-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

    -- 8. Return success response with IDs and Profile info
    RETURN json_build_object(
        'success', true,
        'registration_id', v_registration_id,
        'friendly_id', v_friendly_id,
        'profile_id', v_profile_id,
        'profile', json_build_object(
            'name', p_name,
            'email', p_email,
            'registration_number', p_reg_number,
            'gender', p_gender,
            'phone', p_phone,
            'department', p_department,
            'year', p_year
        )
    );
END;
$$;
