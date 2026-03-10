"use client";

import { useEffect, useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ApprovedEmail {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function ApprovedEmailsPage() {
  const [emails, setEmails] = useState<ApprovedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("parent");

  useEffect(() => {
    fetchEmails();
  }, []);

  async function fetchEmails() {
    const supabase = createClient();
    const { data } = await supabase
      .from("approved_emails")
      .select("*")
      .order("created_at", { ascending: false });
    setEmails(data || []);
    setLoading(false);
  }

  async function addEmail(e: FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("approved_emails")
      .insert({ email: newEmail.toLowerCase().trim(), role: newRole })
      .select()
      .single();

    if (!error && data) {
      setEmails((prev) => [data, ...prev]);
      setNewEmail("");
    }
  }

  async function removeEmail(id: string) {
    const supabase = createClient();
    await supabase.from("approved_emails").delete().eq("id", id);
    setEmails((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">מיילים מאושרים</h1>
        <p className="text-sand-500 mt-1">כתובות מייל שמורשות להירשם אוטומטית</p>
      </div>

      {/* Add new email */}
      <form onSubmit={addEmail} className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200 mb-6">
        <h2 className="font-bold text-sand-900 mb-4">הוספת מייל חדש</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="email@example.com"
              type="email"
              dir="ltr"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900"
          >
            <option value="parent">הורה</option>
            <option value="student">תלמיד</option>
            <option value="teacher">מורה</option>
            <option value="admin">מנהל</option>
          </select>
          <Button type="submit">הוספה</Button>
        </div>
      </form>

      {/* Email list */}
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-sand-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden">
          {emails.length === 0 ? (
            <p className="p-6 text-center text-sand-500">אין מיילים מאושרים.</p>
          ) : (
            <div className="divide-y divide-sand-100">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-sand-50/50"
                >
                  <div>
                    <p className="font-medium text-sand-900" dir="ltr">{email.email}</p>
                    <p className="text-sm text-sand-500">
                      {email.role === "parent" ? "הורה" :
                       email.role === "teacher" ? "מורה" :
                       email.role === "student" ? "תלמיד" : "מנהל"}
                    </p>
                  </div>
                  <button
                    onClick={() => removeEmail(email.id)}
                    className="text-sand-400 hover:text-rainbow-red transition-colors p-2"
                    title="הסרה"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
