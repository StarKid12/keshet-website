-- Add house (division) to profiles and multi-class support

-- House column: beit_tseirim, hamama, shkbag, tichon
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS house TEXT;

-- Junction table for multi-class membership
CREATE TABLE IF NOT EXISTS student_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, class_id)
);

-- RLS
ALTER TABLE student_classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view class memberships" ON student_classes;
CREATE POLICY "Users can view class memberships"
  ON student_classes FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
  );

DROP POLICY IF EXISTS "Admins can insert class memberships" ON student_classes;
CREATE POLICY "Admins can insert class memberships"
  ON student_classes FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can delete class memberships" ON student_classes;
CREATE POLICY "Admins can delete class memberships"
  ON student_classes FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_student_classes_student ON student_classes(student_id);
CREATE INDEX IF NOT EXISTS idx_student_classes_class ON student_classes(class_id);

-- Seed junction table from existing profiles.class_id
INSERT INTO student_classes (student_id, class_id)
SELECT id, class_id FROM profiles
WHERE class_id IS NOT NULL AND role IN ('student', 'parent')
ON CONFLICT (student_id, class_id) DO NOTHING;
