"use client";

import { useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RoleSelector } from "@/components/ui/RoleSelector";

export default function AdminMessagesPage() {
  const { user } = useUser();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!body.trim() || !user) return;

    setSending(true);
    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      type: "announcement",
      subject: subject || null,
      body,
      sender_id: user.id,
      is_pinned: isPinned,
      target_roles: targetRoles,
      class_id: null, // school-wide
    });
    setSending(false);

    if (error) {
      alert("שגיאה בשליחת ההודעה: " + error.message);
      return;
    }

    setSent(true);
    setSubject("");
    setBody("");
    setIsPinned(false);
    setTargetRoles([]);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">שליחת הודעה</h1>
        <p className="text-sand-500 mt-1">שלחו הכרזה לכלל בית הספר</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200 max-w-2xl">
        {sent && (
          <div className="bg-rainbow-green/10 text-rainbow-green rounded-lg p-3 mb-4 text-sm font-medium">
            ההודעה נשלחה בהצלחה!
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-5">
          <Input
            label="נושא"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="נושא ההודעה (אופציונלי)"
          />
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">
              תוכן ההודעה
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900
                placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                outline-none transition-colors resize-none"
              placeholder="כתבו את ההודעה..."
              required
            />
          </div>
          <RoleSelector selectedRoles={targetRoles} onChange={setTargetRoles} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 rounded border-sand-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-sand-700">נעץ הודעה (תופיע בראש הרשימה)</span>
          </label>
          <Button type="submit" size="lg" disabled={sending || !body.trim()}>
            {sending ? "שולח..." : "שליחת הודעה"}
          </Button>
        </form>
      </div>
    </div>
  );
}
