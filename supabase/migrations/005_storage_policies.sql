-- Storage RLS policies for site-content bucket

-- Allow anyone to view/download images (public bucket)
CREATE POLICY "Public read access on site-content"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-content');

-- Allow admins to upload images
CREATE POLICY "Admin upload to site-content"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-content'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to update (upsert) images
CREATE POLICY "Admin update site-content"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-content'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to delete images
CREATE POLICY "Admin delete from site-content"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-content'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
