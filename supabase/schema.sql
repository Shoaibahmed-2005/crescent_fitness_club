-- Drop existing objects to avoid conflicts during repeated runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS sub_events;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS profiles;

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  gender TEXT CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
  role TEXT DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'ADMIN')),
  phone TEXT,
  registration_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup and assign ADMIN to first 3 users
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  admin_count INT;
BEGIN
  -- Count current admins
  SELECT COUNT(*) INTO admin_count FROM public.profiles WHERE role = 'ADMIN';
  
  -- Insert into public.profiles
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'name',
    CASE 
      WHEN admin_count < 3 THEN 'ADMIN'
      ELSE 'STUDENT'
    END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();


-- 2. Events Table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  venue TEXT,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES profiles(id)
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are viewable by everyone." ON events FOR SELECT USING (true);
CREATE POLICY "Only Admins can modify events." ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);


-- 3. Sub Events Table
CREATE TABLE sub_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  gender_restriction TEXT CHECK (gender_restriction IN ('MALE_ONLY', 'FEMALE_ONLY', 'GENERAL')) DEFAULT 'GENERAL',
  venue TEXT,
  description TEXT,
  image_url TEXT,
  rules TEXT,
  max_capacity INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE sub_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sub_events are viewable by everyone." ON sub_events FOR SELECT USING (true);
CREATE POLICY "Only Admins can modify sub_events." ON sub_events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);


-- 4. Registrations Table
CREATE TABLE registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sub_event_id UUID REFERENCES sub_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('CONFIRMED', 'WAITLISTED', 'CANCELLED')) DEFAULT 'CONFIRMED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(sub_event_id, user_id) -- Prevent duplicate registrations
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
-- Admins can see all registrations, Students can see their own
CREATE POLICY "Registrations view policy" ON registrations FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
-- Students can register themselves
CREATE POLICY "Users can create their own registrations" ON registrations FOR INSERT WITH CHECK (
  auth.uid() = user_id
);


-- 5. Set up Storage for Event Images (Run these in SQL editor to create bucket)
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Event Images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'event-images');
CREATE POLICY "Only Admins can upload images." ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'event-images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- 6. RPC Functions
CREATE OR REPLACE FUNCTION get_sub_event_counts()
RETURNS TABLE(sub_event_id UUID, reg_count BIGINT)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT sub_event_id, COUNT(*) FROM registrations GROUP BY sub_event_id;
$$;
