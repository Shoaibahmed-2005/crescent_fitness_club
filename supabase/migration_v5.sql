-- Fix for Storage Bucket RLS Policy failing on image uploads
-- The original policy failed because it looked for "profiles" in the "storage" schema instead of "public".

-- 1. Drop the existing faulty policy
DROP POLICY IF EXISTS "Only Admins can upload images." ON storage.objects;

-- 2. Create the corrected policy using "public.profiles"
CREATE POLICY "Only Admins can upload images." ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'event-images' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Note: We also need an UPDATE policy in case the system ever needs to overwrite
DROP POLICY IF EXISTS "Only Admins can update images." ON storage.objects;
CREATE POLICY "Only Admins can update images." ON storage.objects FOR UPDATE WITH CHECK (
  bucket_id = 'event-images' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
