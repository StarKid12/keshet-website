-- Add approval workflow for student photo uploads
-- Photos uploaded by teachers/admins are auto-approved; student uploads need approval

-- Add is_approved column (default true for backward compat with existing photos)
ALTER TABLE photos ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT TRUE;

-- Drop old and current policies (safe to re-run)
DROP POLICY IF EXISTS "Approved users can view photos" ON photos;
DROP POLICY IF EXISTS "Admin/teacher can manage photos" ON photos;
DROP POLICY IF EXISTS "Users can view approved photos" ON photos;
DROP POLICY IF EXISTS "Approved users can upload photos" ON photos;
DROP POLICY IF EXISTS "Admin/teacher can update photos" ON photos;
DROP POLICY IF EXISTS "Admin/teacher can delete photos" ON photos;

-- Students/parents only see approved photos in their class; teachers/admins see all
CREATE POLICY "Users can view approved photos"
  ON photos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM photo_albums pa
      JOIN profiles p ON p.id = auth.uid()
      WHERE pa.id = photos.album_id
        AND p.is_approved = TRUE
        AND (p.class_id = pa.class_id OR p.role IN ('admin', 'teacher'))
    )
    AND (
      is_approved = TRUE
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
      OR uploaded_by = auth.uid()
    )
  );

-- Approved users can insert photos (students get is_approved=false enforced via frontend)
CREATE POLICY "Approved users can upload photos"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM photo_albums pa
      JOIN profiles p ON p.id = auth.uid()
      WHERE pa.id = photos.album_id
        AND p.is_approved = TRUE
        AND (p.class_id = pa.class_id OR p.role IN ('admin', 'teacher'))
    )
  );

-- Teachers/admins can update photos (for approval)
CREATE POLICY "Admin/teacher can update photos"
  ON photos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
  );

-- Teachers/admins can delete photos
CREATE POLICY "Admin/teacher can delete photos"
  ON photos FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
  );

-- Update storage: allow approved students to upload too
DROP POLICY IF EXISTS "Teachers and admins can upload class photos" ON storage.objects;
DROP POLICY IF EXISTS "Approved users can upload class photos" ON storage.objects;
CREATE POLICY "Approved users can upload class photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'class-photos'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = TRUE)
  );
