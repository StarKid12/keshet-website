-- The blog audience-targeting feature ('מי יראה את הפוסט?') from migration
-- 010 only made sense when there were students/parents/teachers. With the
-- community gone, blog posts are simply published-or-not, so target_roles
-- is dead data.
ALTER TABLE public.blog_posts DROP COLUMN IF EXISTS target_roles;
