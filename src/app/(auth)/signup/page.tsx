"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      const msg = error.message.includes("not pre-approved")
        ? "האימייל הזה לא הוזמן עדיין. בקשו ממנהל קיים להוסיף אתכם."
        : error.message;
      setError(msg);
      setSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-sand-200 p-8">
      <div className="text-center mb-8">
        <Link href="/">
          <img src="/images/logo.png" alt="קשת" className="h-16 mx-auto" />
        </Link>
        <p className="text-sand-600 mt-2">פתיחת חשבון מנהל</p>
        <p className="text-xs text-sand-400 mt-1">
          רק אימיילים שהוזמנו מראש על ידי מנהל קיים יכולים להירשם.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="שם מלא"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          label="אימייל"
          type="email"
          dir="auto"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
        <Input
          label="סיסמה"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="לפחות 6 תווים"
          minLength={6}
          required
        />

        {error && (
          <p className="text-sm text-rainbow-red bg-rainbow-red/5 rounded-lg p-3">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? "יוצר חשבון..." : "הרשמה"}
        </Button>
      </form>

      <p className="text-center text-sm text-sand-500 mt-6">
        יש לכם כבר חשבון?{" "}
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          כניסה
        </Link>
      </p>
    </div>
  );
}
