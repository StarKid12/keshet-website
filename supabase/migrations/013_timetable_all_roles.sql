-- Allow any approved user (not just students) to manage their own timetable
-- Teachers and admins also need personal timetables

-- Update INSERT policy to allow any approved user
DROP POLICY IF EXISTS "Users can insert own timetable entries" ON student_timetable;
CREATE POLICY "Users can insert own timetable entries"
  ON student_timetable FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = true)
  );
