-- Timetable builder: lesson options (teacher-managed) + student timetable entries

-- Lesson options that teachers/admins add for students to pick from
CREATE TABLE timetable_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 4),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject TEXT NOT NULL,
  teacher_name TEXT,
  room TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual student timetable selections
CREATE TABLE student_timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 4),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  option_id UUID REFERENCES timetable_options(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  teacher_name TEXT,
  room TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- One entry per student per time slot per day
  UNIQUE(student_id, day_of_week, start_time)
);

-- RLS
ALTER TABLE timetable_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_timetable ENABLE ROW LEVEL SECURITY;

-- Timetable options: everyone can view, admins/teachers can manage
CREATE POLICY "Approved users can view timetable options"
  ON timetable_options FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = true)
  );

CREATE POLICY "Admins and teachers can insert timetable options"
  ON timetable_options FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
  );

CREATE POLICY "Admins and teachers can update timetable options"
  ON timetable_options FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
  );

CREATE POLICY "Admins and teachers can delete timetable options"
  ON timetable_options FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
  );

-- Student timetable: fully private, any approved user can manage their own
CREATE POLICY "Users can view own timetable"
  ON student_timetable FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Users can insert own timetable entries"
  ON student_timetable FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = true)
  );

CREATE POLICY "Users can update own timetable entries"
  ON student_timetable FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Users can delete own timetable entries"
  ON student_timetable FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());
