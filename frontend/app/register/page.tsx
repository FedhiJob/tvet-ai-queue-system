"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/providers/AuthProvider";
import { register as apiRegister } from "@/app/services/auth.service";

type Role = "student" | string;

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const emailTrim = email.trim();
    if (!emailTrim) {
      setError("Email is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Register via backend
      await apiRegister({ email: emailTrim, password, role });

      // Immediately log in for smoother UX
      await login(emailTrim, password);
      router.push("/requests");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated) {
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 p-6">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Sign up</h1>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-300/70"
              placeholder="student@school.edu"
              autoComplete="email"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-300/70"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-300/70"
            >
              <option value="student">student</option>
            </select>
          </label>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            className="w-full rounded-xl bg-black text-white dark:bg-zinc-100 dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <a className="underline" href="/login">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

