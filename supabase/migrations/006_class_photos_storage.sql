-- Storage policies for class-photos bucket
-- NOTE: You must first create the "class-photos" bucket in the Supabase Dashboard
-- (Storage > New bucket > name: "class-photos", Public: ON)

-- Allow authenticated users to view photos
CREATE POLICY "Authenticated users can view class photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'class-photos');

-- Allow teachers and admins to upload photos
CREATE POLICY "Teachers and admins can upload class photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'class-photos'
  AND (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  )
);

-- Allow teachers and admins to delete photos
CREATE POLICY "Teachers and admins can delete class photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'class-photos'
  AND (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  )
);
