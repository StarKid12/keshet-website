-- ============================================
-- Committee Polls (סקרים) Feature
-- ============================================

-- Add polls privilege to committees table
ALTER TABLE committees ADD COLUMN can_create_polls BOOLEAN NOT NULL DEFAULT FALSE;

-- Polls table
CREATE TABLE committee_polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  committee_id UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  target_roles TEXT[] NOT NULL DEFAULT '{}',
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  closed_at TIMESTAMPTZ,
  closed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poll options (multiple choice)
CREATE TABLE committee_poll_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES committee_polls(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);

-- Poll votes (one per user per poll)
CREATE TABLE committee_poll_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES committee_polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES committee_poll_options(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, voter_id)
);

-- Poll comments (discussion)
CREATE TABLE committee_poll_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES committee_polls(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_polls_committee ON committee_polls(committee_id);
CREATE INDEX idx_polls_open ON committee_polls(is_open, committee_id);
CREATE INDEX idx_poll_options_poll ON committee_poll_options(poll_id);
CREATE INDEX idx_poll_votes_poll ON committee_poll_votes(poll_id);
CREATE INDEX idx_poll_votes_voter ON committee_poll_votes(voter_id);
CREATE INDEX idx_poll_comments_poll ON committee_poll_comments(poll_id, created_at);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER committee_polls_updated_at
  BEFORE UPDATE ON committee_polls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE committee_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_poll_comments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- committee_polls policies
-- ============================================

-- SELECT: committee members, users whose role matches target_roles, or admin
CREATE POLICY "View polls" ON committee_polls FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM committee_members cm
    WHERE cm.committee_id = committee_polls.committee_id AND cm.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.is_approved = TRUE AND p.role::TEXT = ANY(committee_polls.target_roles)
  )
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- INSERT: committee members only
CREATE POLICY "Create polls" ON committee_polls FOR INSERT WITH CHECK (
  auth.uid() = creator_id AND (
    EXISTS (
      SELECT 1 FROM committee_members cm
      WHERE cm.committee_id = committee_polls.committee_id AND cm.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
);

-- UPDATE: poll creator, committee teacher, or admin (for closing)
CREATE POLICY "Close polls" ON committee_polls FOR UPDATE USING (
  creator_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM committees c
    WHERE c.id = committee_polls.committee_id AND c.teacher_id = auth.uid()
  )
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- committee_poll_options policies
-- ============================================

-- SELECT: same as parent poll
CREATE POLICY "View poll options" ON committee_poll_options FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM committee_polls cp
    WHERE cp.id = committee_poll_options.poll_id AND (
      EXISTS (
        SELECT 1 FROM committee_members cm
        WHERE cm.committee_id = cp.committee_id AND cm.user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.is_approved = TRUE AND p.role::TEXT = ANY(cp.target_roles)
      )
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  )
);

-- INSERT: handled by create_poll RPC function (SECURITY DEFINER)
-- No direct INSERT policy needed for normal users

-- ============================================
-- committee_poll_votes policies
-- ============================================

-- SELECT: committee members always, non-members only on closed polls, admin always
CREATE POLICY "View votes" ON committee_poll_votes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM committee_polls cp
    JOIN committee_members cm ON cm.committee_id = cp.committee_id
    WHERE cp.id = committee_poll_votes.poll_id AND cm.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM committee_polls cp
    WHERE cp.id = committee_poll_votes.poll_id AND cp.is_open = FALSE
  )
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- INSERT: eligible voters on open polls only
CREATE POLICY "Cast vote" ON committee_poll_votes FOR INSERT WITH CHECK (
  auth.uid() = voter_id
  AND EXISTS (
    SELECT 1 FROM committee_polls cp
    WHERE cp.id = committee_poll_votes.poll_id
    AND cp.is_open = TRUE
    AND (
      EXISTS (
        SELECT 1 FROM committee_members cm
        WHERE cm.committee_id = cp.committee_id AND cm.user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.is_approved = TRUE AND p.role::TEXT = ANY(cp.target_roles)
      )
    )
  )
);

-- ============================================
-- committee_poll_comments policies
-- ============================================

-- SELECT: same users who can see the poll
CREATE POLICY "View poll comments" ON committee_poll_comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM committee_polls cp
    WHERE cp.id = committee_poll_comments.poll_id AND (
      EXISTS (
        SELECT 1 FROM committee_members cm
        WHERE cm.committee_id = cp.committee_id AND cm.user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.is_approved = TRUE AND p.role::TEXT = ANY(cp.target_roles)
      )
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  )
);

-- INSERT: same users who can see the poll
CREATE POLICY "Add poll comment" ON committee_poll_comments FOR INSERT WITH CHECK (
  auth.uid() = author_id AND EXISTS (
    SELECT 1 FROM committee_polls cp
    WHERE cp.id = committee_poll_comments.poll_id AND (
      EXISTS (
        SELECT 1 FROM committee_members cm
        WHERE cm.committee_id = cp.committee_id AND cm.user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.is_approved = TRUE AND p.role::TEXT = ANY(cp.target_roles)
      )
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  )
);

-- ============================================
-- REALTIME
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE committee_poll_comments;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Atomic poll creation: inserts poll + options in a single transaction
CREATE OR REPLACE FUNCTION create_poll(
  p_committee_id UUID,
  p_creator_id UUID,
  p_question TEXT,
  p_target_roles TEXT[],
  p_options TEXT[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_poll_id UUID;
  i INT;
BEGIN
  -- Verify the creator is a committee member or admin
  IF NOT EXISTS (
    SELECT 1 FROM committee_members WHERE committee_id = p_committee_id AND user_id = p_creator_id
  ) AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = p_creator_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'User is not a member of this committee';
  END IF;

  -- Insert the poll
  INSERT INTO committee_polls (committee_id, creator_id, question, target_roles)
  VALUES (p_committee_id, p_creator_id, p_question, p_target_roles)
  RETURNING id INTO v_poll_id;

  -- Insert options
  FOR i IN 1..array_length(p_options, 1) LOOP
    INSERT INTO committee_poll_options (poll_id, label, display_order)
    VALUES (v_poll_id, p_options[i], i);
  END LOOP;

  RETURN v_poll_id;
END;
$$;
