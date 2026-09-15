-- 1. Add participant_registration_limit to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS participant_registration_limit INT DEFAULT NULL;

-- 2. Drop the old function so we can recreate it
DROP FUNCTION IF EXISTS process_registration(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, UUID);

-- 3. Create the updated function
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
    v_participant_registration_limit INT;
    v_current_registrations INT;
    v_participant_event_registrations INT;
    v_registration_id UUID;
    v_existing_email TEXT;
    v_existing_name TEXT;
    v_existing_reg_number TEXT;
BEGIN
    -- Trim email to ensure no whitespace mismatch
    p_email := LOWER(TRIM(p_email));

    -- 1. Retrieve Sub-Event & Event details
    SELECT se.event_id, se.gender_restriction, se.max_capacity,
           e.registration_deadline, e.is_active, e.participant_registration_limit
    INTO v_event_id, v_gender_restriction, v_max_capacity, v_deadline, v_is_active, v_participant_registration_limit
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

    -- 3. Validate Gender Eligibility (skip if p_gender is null to allow genderless registration)
    IF p_gender IS NOT NULL THEN
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

    -- 5. Find or Create Profile 
    -- Match on Email OR Phone OR RRN OR Name (ignoring empty strings)
    SELECT id, name, registration_number INTO v_profile_id, v_existing_name, v_existing_reg_number
    FROM profiles
    WHERE 
        (NULLIF(TRIM(p_email), '') IS NOT NULL AND LOWER(TRIM(email)) = p_email) OR
        (NULLIF(TRIM(p_phone), '') IS NOT NULL AND TRIM(phone) = TRIM(p_phone)) OR
        (NULLIF(TRIM(p_reg_number), '') IS NOT NULL AND LOWER(TRIM(registration_number)) = LOWER(TRIM(p_reg_number))) OR
        (NULLIF(TRIM(p_name), '') IS NOT NULL AND LOWER(TRIM(name)) = LOWER(TRIM(p_name)))
    LIMIT 1;

    IF FOUND THEN
        -- Check participant registration limit for this specific event
        IF v_participant_registration_limit IS NOT NULL THEN
            SELECT COUNT(*) INTO v_participant_event_registrations
            FROM registrations r
            JOIN sub_events se ON r.sub_event_id = se.id
            WHERE r.user_id = v_profile_id AND se.event_id = v_event_id;

            IF v_participant_event_registrations >= v_participant_registration_limit THEN
                RAISE EXCEPTION 'You have already reached the maximum number of event registrations allowed.';
            END IF;
        END IF;

        -- Update the profile with latest details
        UPDATE profiles SET 
          name = COALESCE(NULLIF(p_name, ''), name),
          phone = COALESCE(NULLIF(p_phone, ''), phone),
          registration_number = COALESCE(NULLIF(p_reg_number, ''), registration_number),
          department = COALESCE(NULLIF(p_department, ''), department),
          year = COALESCE(NULLIF(p_year, ''), year),
          -- ensure email is updated if missing (though unlikely since we use it heavily)
          email = COALESCE(NULLIF(p_email, ''), email)
        WHERE id = v_profile_id;
        
    ELSE
        -- Generate a new profile ID and insert
        v_profile_id := gen_random_uuid();
        INSERT INTO profiles (id, name, email, gender, phone, registration_number, department, year, role)
        VALUES (v_profile_id, p_name, p_email, p_gender, p_phone, p_reg_number, p_department, p_year, 'STUDENT');
    END IF;

    -- 6. Check for duplicate registration for this exact sub-event
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

    -- 8. Return success response with IDs and Profile info
    RETURN json_build_object(
        'success', true,
        'registration_id', v_registration_id,
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
