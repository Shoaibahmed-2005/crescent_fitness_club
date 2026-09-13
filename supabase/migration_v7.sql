-- Allow Admins to delete registrations
CREATE POLICY "Admins can delete registrations" ON registrations FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
