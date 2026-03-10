"use client";

import { Suspense, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("אימייל או סיסמה שגויים");
      setIsLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-sand-200 p-8">
      <div className="text-center mb-8">
        <Link href="/">
          <img src="/images/logo.png" alt="קשת" className="h-16 mx-auto" />
        </Link>
        <p className="text-sand-600 mt-2">כניסה לאזור האישי</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          placeholder="••••••••"
          required
        />

        {error && (
          <p className="text-sm text-rainbow-red bg-rainbow-red/5 rounded-lg p-3">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "מתחבר..." : "כניסה"}
        </Button>
      </form>

      <p className="text-center text-sm text-sand-500 mt-6">
        אין לכם חשבון?{" "}
        <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
          הרשמה
        </Link>
      </p>

      <div className="mt-6 pt-4 border-t border-sand-100">
        <Link href="/" className="block text-center text-sm text-sand-500 hover:text-sand-700">
          חזרה לאתר הראשי
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-2xl shadow-lg border border-sand-200 p-8 animate-pulse">
        <div className="h-8 bg-sand-200 rounded w-24 mx-auto mb-8" />
        <div className="space-y-5">
          <div className="h-10 bg-sand-200 rounded" />
          <div className="h-10 bg-sand-200 rounded" />
          <div className="h-10 bg-sand-200 rounded" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
