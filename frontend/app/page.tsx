import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {/* Top navigation */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9">
              <Image
                src="/file.svg"
                alt="TVET AI Queue System"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                TVET AI Queue System
              </p>
              <p className="text-xs text-slate-500">AI + Queue + Scheduling</p>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/requests/new"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Login
            </Link>
            <Link
              href="/requests/new"
              className="inline-flex h-10 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Get Started
            </Link>
          </nav>
        </header>

        {/* Hero: problem + solution, designed to be understood in <10 seconds */}
        <section className="mt-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                In 10 seconds you’ll know: what it is, who it’s for, and how to start.
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                AI-Powered Registrar Workflow
              </h1>

              <h2 className="mt-3 text-xl font-semibold text-slate-900">
                AI-Enabled Queue and Scheduling for TVET Registrar Services
              </h2>

              <p className="mt-4 max-w-xl text-slate-600">
                Reduce waiting times. Automatically classify requests, prioritize urgent cases,
                predict expected wait time, and schedule appointments for students and registrar staff.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/requests/new"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Submit a Request
                </Link>
                <Link
                  href="/requests/new"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                >
                  View Demo
                </Link>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">Problem</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    <li>Long waiting lines</li>
                    <li>Manual request handling</li>
                    <li>No prioritization</li>
                    <li>Unpredictable appointments</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">Solution (AI)</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    <li>AI request classification</li>
                    <li>Priority queue management</li>
                    <li>Smart appointment scheduling</li>
                    <li>Waiting-time prediction</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">System Snapshot</p>
                <span className="text-xs font-semibold text-slate-600">Queue • AI • Scheduling</span>
              </div>

              <div className="mt-4 relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                <Image
                  src="/globe.svg"
                  alt="Queue dashboard preview"
                  fill
                  className="object-contain p-6"
                  priority
                />
              </div>

              <div className="mt-4 grid gap-2 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">1) Student submits</p>
                  <span className="text-xs text-slate-500">Request details</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">2) AI analyzes</p>
                  <span className="text-xs text-slate-500">Classify + estimate</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">3) Priority assigned</p>
                  <span className="text-xs text-slate-500">Urgent first</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">4) Appointment scheduled</p>
                  <span className="text-xs text-slate-500">Availability + workload</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Built for instructors, administrators, and institute staff—not just developers.
              </p>
            </div>
          </div>
        </section>

        {/* Feature showcase */}
        <section className="mt-12">
          <h3 className="text-lg font-bold tracking-tight text-slate-900">
            What makes it intelligent
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">AI Classification</p>
              <p className="mt-2 text-sm text-slate-600">
                Automatically categorizes registrar requests.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Priority Queue</p>
              <p className="mt-2 text-sm text-slate-600">
                Urgent requests move ahead using priority rules.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Smart Scheduling</p>
              <p className="mt-2 text-sm text-slate-600">
                Assigns appointments based on availability and workload.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Wait Prediction</p>
              <p className="mt-2 text-sm text-slate-600">
                Estimates expected waiting time for transparency.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Ready to experience the workflow?</p>
              <p className="mt-1 text-sm text-slate-600">
                Submit a request, track progress, and see intelligent queue management in action.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/requests/new"
                className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-10 py-6 text-center text-xs text-slate-500">
          © 2026 TVET AI Queue System • Capstone Project • AI + Data Structures + Scheduling
        </footer>
      </main>
    </div>
  );
}


