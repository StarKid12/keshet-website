-- ============================================
-- Keshet School Database Schema
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'parent', 'student');
CREATE TYPE message_type AS ENUM ('announcement', 'direct');

-- ============================================
-- TABLES
-- ============================================

-- Classes
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  grade_level INTEGER NOT NULL CHECK (grade_level >= 0 AND grade_level <= 12),
  academic_year TEXT NOT NULL DEFAULT '2025-2026',
  teacher_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'parent',
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  phone TEXT,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add teacher FK to classes now that profiles exists
ALTER TABLE classes ADD CONSTRAINT fk_teacher FOREIGN KEY (teacher_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Approved Emails (whitelist)
CREATE TABLE approved_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'parent',
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  added_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photo Albums
CREATE TABLE photo_albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  cover_photo_url TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID NOT NULL REFERENCES photo_albums(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedules
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 5),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject TEXT NOT NULL,
  teacher_name TEXT,
  room TEXT,
  academic_year TEXT DEFAULT '2025-2026',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type message_type NOT NULL DEFAULT 'announcement',
  subject TEXT,
  body TEXT NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message Recipients
CREATE TABLE message_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ
);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_chat_messages_class_date ON chat_messages(class_id, created_at DESC);
CREATE INDEX idx_messages_class ON messages(class_id);
CREATE INDEX idx_messages_type ON messages(type);
CREATE INDEX idx_schedules_class ON schedules(class_id);
CREATE INDEX idx_photos_album ON photos(album_id);
CREATE INDEX idx_photo_albums_class ON photo_albums(class_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX idx_profiles_approved ON profiles(is_approved);
CREATE INDEX idx_profiles_class ON profiles(class_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  approved_record approved_emails%ROWTYPE;
BEGIN
  -- Check if email is in approved list
  SELECT * INTO approved_record
  FROM approved_emails
  WHERE email = NEW.email;

  IF FOUND THEN
    INSERT INTO profiles (id, email, full_name, role, is_approved, class_id)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      approved_record.role,
      TRUE,
      approved_record.class_id
    );
  ELSE
    INSERT INTO profiles (id, email, full_name, role, is_approved)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      'parent',
      FALSE
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE approved_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Approved emails: admin only
CREATE POLICY "Admins can manage approved emails" ON approved_emails FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Classes: authenticated users can read
CREATE POLICY "Authenticated users can view classes" ON classes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage classes" ON classes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Blog posts: public read for published, admin/teacher write
CREATE POLICY "Anyone can view published posts" ON blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins can manage posts" ON blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- Photo albums: approved users can view their class, admin/teacher can manage
CREATE POLICY "Approved users can view class albums" ON photo_albums FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = TRUE AND (class_id = photo_albums.class_id OR role IN ('admin', 'teacher')))
);
CREATE POLICY "Admin/teacher can manage albums" ON photo_albums FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- Photos: same as albums
CREATE POLICY "Approved users can view photos" ON photos FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM photo_albums pa
    JOIN profiles p ON p.id = auth.uid()
    WHERE pa.id = photos.album_id AND p.is_approved = TRUE AND (p.class_id = pa.class_id OR p.role IN ('admin', 'teacher'))
  )
);
CREATE POLICY "Admin/teacher can manage photos" ON photos FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- Schedules: approved users can view their class
CREATE POLICY "Approved users can view schedules" ON schedules FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = TRUE AND (class_id = schedules.class_id OR role IN ('admin', 'teacher')))
);
CREATE POLICY "Admins can manage schedules" ON schedules FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Messages: announcements visible to class members, admin/teacher can send
CREATE POLICY "Users can view announcements" ON messages FOR SELECT USING (
  type = 'announcement' AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = TRUE AND (messages.class_id IS NULL OR class_id = messages.class_id OR role IN ('admin', 'teacher')))
);
CREATE POLICY "Admin/teacher can send messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- Message recipients
CREATE POLICY "Users can view own receipts" ON message_recipients FOR SELECT USING (recipient_id = auth.uid());
CREATE POLICY "Users can update own receipts" ON message_recipients FOR UPDATE USING (recipient_id = auth.uid());

-- Chat messages: class members can read/write
CREATE POLICY "Class members can view chat" ON chat_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = TRUE AND (class_id = chat_messages.class_id OR role IN ('admin', 'teacher')))
);
CREATE POLICY "Class members can send chat" ON chat_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = TRUE AND (class_id = chat_messages.class_id OR role IN ('admin', 'teacher')))
);

-- ============================================
-- REALTIME
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- ============================================
-- STORAGE BUCKETS (run via Supabase dashboard or API)
-- ============================================
-- Create these buckets manually in the Supabase dashboard:
-- 1. class-photos (private)
-- 2. blog-images (public)
-- 3. avatars (public)
