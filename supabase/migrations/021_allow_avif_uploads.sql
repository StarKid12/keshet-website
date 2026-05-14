-- Allow image/avif uploads to the site-content bucket.
-- Without this, Supabase rejects .avif files at the storage layer even though
-- the file picker accepts them, returning "mime type image/avif is not supported".
UPDATE storage.buckets
SET allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
WHERE id = 'site-content';
