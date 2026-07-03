"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    setPending(true);
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Email requis");
      setPending(false);
      return;
    }

    const origin = window.location.origin;
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    setPending(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setMessage(
      "Lien envoyé. Vérifiez votre boîte mail (et le dossier spam).",
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-field">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="input-field"
          placeholder="vous@exemple.com"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400" role="status">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full"
      >
        {pending ? "Envoi…" : "Recevoir le lien"}
      </button>
    </form>
  );
}
