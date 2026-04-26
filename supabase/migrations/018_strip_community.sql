-- Strip the student/teacher/parent community area.
-- Site is now: public marketing pages + admin-only CMS.
-- The `profiles` table is kept (admins only) because it backs middleware role
-- checks and is referenced by blog_posts.author_id, site_content.updated_by,
-- staff_members, and events.

-- 1. Stop auto-creating profiles on signup. Signup is gone but be explicit.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS handle_new_user();

-- 2. Drop community tables. CASCADE clears FKs and dependent policies.
DROP TABLE IF EXISTS public.committee_poll_comments CASCADE;
DROP TABLE IF EXISTS public.committee_poll_votes CASCADE;
DROP TABLE IF EXISTS public.committee_poll_options CASCADE;
DROP TABLE IF EXISTS public.committee_polls CASCADE;
DROP TABLE IF EXISTS public.committee_messages CASCADE;
DROP TABLE IF EXISTS public.committee_members CASCADE;
DROP TABLE IF EXISTS public.committees CASCADE;

DROP TABLE IF EXISTS public.student_timetable CASCADE;
DROP TABLE IF EXISTS public.timetable_options CASCADE;
DROP TABLE IF EXISTS public.student_classes CASCADE;

DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.message_recipients CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;

DROP TABLE IF EXISTS public.photos CASCADE;
DROP TABLE IF EXISTS public.photo_albums CASCADE;

DROP TABLE IF EXISTS public.schedules CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.approved_emails CASCADE;

-- 3. Drop class-photos storage policies. The bucket and its objects must be
--    deleted manually via the Supabase Dashboard (Storage → class-photos →
--    empty bucket → delete bucket) because Supabase blocks direct deletes
--    on storage.objects / storage.buckets.
DROP POLICY IF EXISTS "Authenticated users can view class photos" ON storage.objects;
DROP POLICY IF EXISTS "Teachers and admins can upload class photos" ON storage.objects;
DROP POLICY IF EXISTS "Teachers and admins can delete class photos" ON storage.objects;
DROP POLICY IF EXISTS "Approved users can upload class photos" ON storage.objects;

-- 4. Replace blog_posts read policy that depended on profiles.is_approved
--    and role-targeting (from migration 010). With no community users, blogs
--    are simply public-once-published, plus admins see drafts.
DROP POLICY IF EXISTS "Anyone can view public blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.blog_posts;
CREATE POLICY "Anyone can view published posts" ON public.blog_posts
  FOR SELECT USING (is_published = TRUE);

-- 5. Drop now-unused columns on profiles. Leaves id, email, full_name,
--    avatar_url, role, created_at, updated_at.
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_approved;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS class_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS phone;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS display_name;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS house;
