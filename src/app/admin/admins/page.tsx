"use client";

import { useEffect, useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AdminRow {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

interface ApprovedEmail {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminAdminsPage() {
  const { user } = useUser();
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [approved, setApproved] = useState<ApprovedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [signupUrl, setSignupUrl] = useState("");

  useEffect(() => {
    setSignupUrl(`${window.location.origin}/signup`);
    fetchAll();
  }, []);

  async function fetchAll() {
    const supabase = createClient();
    const [adminsRes, approvedRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, created_at")
        .eq("role", "admin")
        .order("created_at", { ascending: true }),
      supabase
        .from("approved_emails")
        .select("id, email, created_at")
        .order("created_at", { ascending: false }),
    ]);
    setAdmins(adminsRes.data || []);
    setApproved(approvedRes.data || []);
    setLoading(false);
  }

  async function handleApprove(e: FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return;

    setAdding(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("approved_emails")
      .insert({ email: trimmed, added_by: user?.id });

    if (error) {
      setError(
        error.code === "23505"
          ? "האימייל הזה כבר ברשימה."
          : error.message
      );
      setAdding(false);
      return;
    }

    setEmailInput("");
    setAdding(false);
    await fetchAll();
  }

  async function handleCancelApproval(id: string) {
    const supabase = createClient();
    await supabase.from("approved_emails").delete().eq("id", id);
    setApproved((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleRemoveAdmin(admin: AdminRow) {
    if (admin.id === user?.id) return;
    if (
      !confirm(
        `להסיר את ${admin.full_name || admin.email} מרשימת המנהלים? החשבון שלו ימחק לחלוטין.`
      )
    )
      return;

    const res = await fetch("/api/admin/remove-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: admin.id }),
    });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "ההסרה נכשלה");
      return;
    }
    setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
  }

  async function copySignupUrl() {
    try {
      await navigator.clipboard.writeText(signupUrl);
    } catch {
      // Clipboard not available — silently ignore
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">מנהלים</h1>
        <p className="text-sand-500 mt-1">
          הוספה והסרה של מנהלים. רק כתובות שמופיעות ברשימה למטה יכולות להירשם.
        </p>
      </div>

      {/* Add admin */}
      <div className="bg-white rounded-2xl shadow-sm border border-sand-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-sand-900 mb-1">הוספת מנהל חדש</h2>
        <p className="text-sm text-sand-500 mb-4">
          הוסיפו את האימייל של המנהל החדש, שלחו לו את הקישור להרשמה, והוא יקבל גישה אוטומטית.
        </p>
        <form onSubmit={handleApprove} className="flex gap-2">
          <div className="flex-1">
            <Input
              type="email"
              dir="ltr"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="new.admin@example.com"
              required
            />
          </div>
          <Button type="submit" disabled={adding || !emailInput.trim()}>
            {adding ? "מוסיף..." : "הוסף"}
          </Button>
        </form>
        {error && (
          <p className="text-sm text-rainbow-red bg-rainbow-red/5 rounded-lg p-3 mt-3">
            {error}
          </p>
        )}

        {signupUrl && (
          <div className="mt-4 flex items-center gap-2 text-xs text-sand-500 bg-sand-50 rounded-lg px-3 py-2">
            <span className="font-medium text-sand-600 shrink-0">קישור להרשמה:</span>
            <code className="font-mono truncate" dir="ltr">
              {signupUrl}
            </code>
            <button
              type="button"
              onClick={copySignupUrl}
              className="ms-auto shrink-0 text-primary-600 hover:text-primary-700 font-medium"
            >
              העתקה
            </button>
          </div>
        )}

        {approved.length > 0 && (
          <div className="mt-5 pt-5 border-t border-sand-100">
            <h3 className="text-sm font-medium text-sand-700 mb-2">
              ממתינים להרשמה ({approved.length})
            </h3>
            <ul className="divide-y divide-sand-100">
              {approved.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-sand-800" dir="ltr">{a.email}</span>
                  <button
                    type="button"
                    onClick={() => handleCancelApproval(a.id)}
                    className="text-sand-500 hover:text-rainbow-red transition-colors"
                  >
                    ביטול הזמנה
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Current admins */}
      <div className="bg-white rounded-2xl shadow-sm border border-sand-200 p-6">
        <h2 className="text-lg font-bold text-sand-900 mb-4">מנהלים נוכחיים</h2>
        {loading ? (
          <div className="text-sand-400 text-sm">טוען...</div>
        ) : admins.length === 0 ? (
          <div className="text-sand-400 text-sm">אין מנהלים.</div>
        ) : (
          <ul className="divide-y divide-sand-100">
            {admins.map((a) => {
              const isMe = a.id === user?.id;
              return (
                <li key={a.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-sand-900">
                      {a.full_name || "—"}
                      {isMe && (
                        <span className="ms-2 text-xs text-primary-600">(אתם)</span>
                      )}
                    </div>
                    <div className="text-sm text-sand-500" dir="ltr">{a.email}</div>
                  </div>
                  {!isMe && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAdmin(a)}
                      className="text-sm text-sand-500 hover:text-rainbow-red transition-colors"
                    >
                      הסרה
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
