"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error("Signup error:", error.message, error);
      if (error.message === "User already registered") {
        setError("כתובת האימייל כבר רשומה במערכת");
      } else if (error.message.includes("Database error")) {
        setError(`שגיאת מסד נתונים: ${error.message}`);
      } else {
        setError(`שגיאה: ${error.message}`);
      }
      setIsLoading(false);
      return;
    }

    router.push("/pending-approval");
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-sand-200 p-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/">
          <img src="/images/logo.png" alt="קשת" className="h-16 mx-auto" />
        </Link>
        <p className="text-sand-600 mt-2">הרשמה לאזור האישי</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="שם מלא"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="ישראל ישראלי"
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
          required
        />
        <Input
          label="אישור סיסמה"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="הזינו שוב את הסיסמה"
          required
        />

        {error && (
          <p className="text-sm text-rainbow-red bg-rainbow-red/5 rounded-lg p-3">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "נרשם..." : "הרשמה"}
        </Button>
      </form>

      <p className="text-sm text-sand-500 text-center mt-4">
        ההרשמה מיועדת למשפחות ולצוות בית הספר בלבד.
        <br />
        הגישה תאושר לאחר אימות.
      </p>

      <p className="text-center text-sm text-sand-500 mt-6">
        כבר יש לכם חשבון?{" "}
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          כניסה
        </Link>
      </p>
    </div>
  );
}
