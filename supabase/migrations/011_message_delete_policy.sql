-- ============================================
-- Add DELETE policy for messages
-- ============================================

-- Admin can delete any message, teacher can delete their own
CREATE POLICY "Admin/teacher can delete messages" ON messages FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  OR (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
    AND sender_id = auth.uid()
  )
);
