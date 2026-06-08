import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            TVET AI Queue System
          </h1>
          <p className="max-w-2xl text-slate-600">
            Submit a registrar request and we’ll classify priority and estimate
            your wait time.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              href="/requests/new"
            >
              Create a Request
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100"
              href="/requests/new"
            >
              View Request Form
            </Link>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">
              How it works
            </h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
              <li>Fill in your request details.</li>
              <li>We predict priority and estimated wait time.</li>
              <li>You track your queue position.</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}

