import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { AuthProvider } from "@/app/providers/AuthProvider";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
        <div className="mx-auto flex min-h-screen max-w-[1440px]">
          {/* Sidebar (Desktop) */}
          <aside className="w-[280px] shrink-0 border-r border-[#E2E8F0] bg-white">
            <div className="flex items-center gap-3 px-5 py-5">
              <div className="relative h-9 w-9">
                <Image
                  src="/file.svg"
                  alt="TVET AI Queue"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">TVET AI Queue</p>
                <p className="text-[12px] text-[#475569]">Admin Workflow Platform</p>
              </div>
            </div>

            <nav className="px-4 pb-6">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/requests/new"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#F1F5F9]"
                  >
                    Student Portal
                  </Link>
                </li>
                <li>
                  <Link
                    href="/requests/new"
                    className="mt-4 inline-flex w-[calc(100%-16px)] items-center justify-center rounded-full bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
                  >
                    Request Submission
                  </Link>
                </li>
                <li>
                  <Link
                    href="/requests"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#F1F5F9]"
                  >
                    My Requests
                  </Link>
                </li>
                <li>
                  <Link
                    href="/queue"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#F1F5F9]"
                  >
                    Queue Monitor
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Topbar */}
            <header className="flex items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white px-6 py-4">
              <div>
                <h1 className="text-lg font-semibold">Institutional Workflow</h1>
                <p className="text-sm text-[#475569]">Queue Management • Appointment Scheduling • Decision Support</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-xs font-semibold">
                  Status: Operational
                </span>
              </div>
            </header>

            <main className="flex-1 px-6 py-8">{children}</main>

            <footer className="border-t border-[#E2E8F0] bg-white px-6 py-4 text-xs text-[#64748B]">
              © {new Date().getFullYear()} TVET AI Queue System
            </footer>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

