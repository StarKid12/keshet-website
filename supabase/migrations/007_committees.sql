-- ============================================
-- Committees (ועדות) Feature
-- ============================================

-- Committees table
CREATE TABLE committees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Committee members
CREATE TABLE committee_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  committee_id UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(committee_id, user_id)
);

-- Committee chat messages
CREATE TABLE committee_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  committee_id UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_committee_messages_committee_date ON committee_messages(committee_id, created_at DESC);
CREATE INDEX idx_committee_members_committee ON committee_members(committee_id);
CREATE INDEX idx_committee_members_user ON committee_members(user_id);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER committees_updated_at
  BEFORE UPDATE ON committees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_messages ENABLE ROW LEVEL SECURITY;

-- Committees: any approved user can view, admin can manage
CREATE POLICY "Approved users can view committees" ON committees FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = TRUE)
);
CREATE POLICY "Admins can manage committees" ON committees FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Committee members: any approved user can view, admin or committee teacher can manage
CREATE POLICY "Approved users can view committee members" ON committee_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_approved = TRUE)
);
CREATE POLICY "Admins can manage committee members" ON committee_members FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Committee teacher can add members" ON committee_members FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM committees c
    WHERE c.id = committee_members.committee_id AND c.teacher_id = auth.uid()
  )
);
CREATE POLICY "Committee teacher can remove members" ON committee_members FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM committees c
    WHERE c.id = committee_members.committee_id AND c.teacher_id = auth.uid()
  )
);

-- Committee messages: members can read/write, admin can read all
CREATE POLICY "Committee members can view messages" ON committee_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM committee_members cm
    WHERE cm.committee_id = committee_messages.committee_id AND cm.user_id = auth.uid()
  )
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Committee members can send messages" ON committee_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND (
    EXISTS (
      SELECT 1 FROM committee_members cm
      WHERE cm.committee_id = committee_messages.committee_id AND cm.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
);

-- ============================================
-- REALTIME
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE committee_messages;
