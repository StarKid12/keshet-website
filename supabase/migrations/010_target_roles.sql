-- ============================================
-- Add target_roles to messages and blog_posts
-- ============================================

-- Add target_roles column to messages
-- Empty array = visible to everyone, otherwise only matching roles
ALTER TABLE messages ADD COLUMN target_roles TEXT[] NOT NULL DEFAULT '{}';

-- Add target_roles column to blog_posts
-- Empty array = public (visible on public blog page), otherwise only visible to matching roles in private area
ALTER TABLE blog_posts ADD COLUMN target_roles TEXT[] NOT NULL DEFAULT '{}';

-- ============================================
-- Update messages RLS policies
-- ============================================

-- Drop existing SELECT policy and replace with one that checks target_roles
DROP POLICY IF EXISTS "Users can view announcements" ON messages;
CREATE POLICY "Users can view announcements" ON messages FOR SELECT USING (
  -- Admin sees everything
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  -- Teachers see everything
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  -- Other approved users: see messages with no target_roles or matching their role
  OR (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = TRUE)
    AND (
      target_roles = '{}'
      OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.role::TEXT = ANY(messages.target_roles)
      )
    )
    AND (class_id IS NULL OR class_id = (SELECT class_id FROM profiles WHERE id = auth.uid()))
  )
);

-- ============================================
-- Update blog_posts RLS policies
-- ============================================

-- Drop existing SELECT policy and replace
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;

-- Public: anyone can view published posts with no role targeting
CREATE POLICY "Anyone can view public blog posts" ON blog_posts FOR SELECT USING (
  -- Public posts (no role targeting, published)
  (is_published = TRUE AND target_roles = '{}')
  -- Admin/teacher sees all posts
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'teacher'))
  -- Approved users with matching role see targeted published posts
  OR (
    is_published = TRUE
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.is_approved = TRUE AND p.role::TEXT = ANY(blog_posts.target_roles)
    )
  )
);
