export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 p-6">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Login</h1>

        <div className="mt-6 space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Email</span>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-300/70"
              placeholder="student@school.edu"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Password</span>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-300/70"
              placeholder="••••••••"
            />
          </label>

          <button
            className="w-full rounded-xl bg-black text-white dark:bg-zinc-100 dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
            type="button"
          >
            Sign in
          </button>
        </div>

        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          Sign in to submit requests and track your queue.
        </p>
      </div>
    </div>
  );
}

