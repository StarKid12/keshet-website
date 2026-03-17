-- ============================================
-- Poll Edit & Delete Support
-- ============================================

-- DELETE policy for committee_polls: creator, committee teacher, or admin
CREATE POLICY "Delete polls" ON committee_polls FOR DELETE USING (
  creator_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM committees c
    WHERE c.id = committee_polls.committee_id AND c.teacher_id = auth.uid()
  )
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- INSERT policy for committee_poll_options (for editing - adding new options)
CREATE POLICY "Insert poll options" ON committee_poll_options FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM committee_polls cp
    WHERE cp.id = committee_poll_options.poll_id AND (
      cp.creator_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM committees c
        WHERE c.id = cp.committee_id AND c.teacher_id = auth.uid()
      )
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  )
);

-- DELETE policy for committee_poll_options (for editing - removing old options)
CREATE POLICY "Delete poll options" ON committee_poll_options FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM committee_polls cp
    WHERE cp.id = committee_poll_options.poll_id AND (
      cp.creator_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM committees c
        WHERE c.id = cp.committee_id AND c.teacher_id = auth.uid()
      )
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  )
);

-- DELETE policy for committee_poll_votes (for cascade when editing resets votes)
CREATE POLICY "Delete votes on managed polls" ON committee_poll_votes FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM committee_polls cp
    WHERE cp.id = committee_poll_votes.poll_id AND (
      cp.creator_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM committees c
        WHERE c.id = cp.committee_id AND c.teacher_id = auth.uid()
      )
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  )
);

-- DELETE policy for committee_poll_comments (for cascade when deleting poll)
CREATE POLICY "Delete comments on managed polls" ON committee_poll_comments FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM committee_polls cp
    WHERE cp.id = committee_poll_comments.poll_id AND (
      cp.creator_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM committees c
        WHERE c.id = cp.committee_id AND c.teacher_id = auth.uid()
      )
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  )
);

-- Function to edit a poll atomically (update question, target_roles, and replace options)
-- Deletes all votes when options change
CREATE OR REPLACE FUNCTION edit_poll(
  p_poll_id UUID,
  p_question TEXT,
  p_target_roles TEXT[],
  p_options TEXT[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_poll RECORD;
BEGIN
  -- Get the poll
  SELECT * INTO v_poll FROM committee_polls WHERE id = p_poll_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Poll not found';
  END IF;

  -- Verify the user can edit (creator, committee teacher, or admin)
  IF NOT (
    v_poll.creator_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM committees c
      WHERE c.id = v_poll.committee_id AND c.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  ) THEN
    RAISE EXCEPTION 'Not authorized to edit this poll';
  END IF;

  -- Update the poll question and target roles
  UPDATE committee_polls
  SET question = p_question, target_roles = p_target_roles
  WHERE id = p_poll_id;

  -- Delete existing votes (options are changing)
  DELETE FROM committee_poll_votes WHERE poll_id = p_poll_id;

  -- Delete existing options
  DELETE FROM committee_poll_options WHERE poll_id = p_poll_id;

  -- Insert new options
  FOR i IN 1..array_length(p_options, 1) LOOP
    INSERT INTO committee_poll_options (poll_id, label, display_order)
    VALUES (p_poll_id, p_options[i], i);
  END LOOP;
END;
$$;
