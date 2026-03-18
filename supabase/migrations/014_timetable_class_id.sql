-- Add class_id to timetable_options so lessons are per-class
ALTER TABLE timetable_options
  ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES classes(id) ON DELETE CASCADE;
