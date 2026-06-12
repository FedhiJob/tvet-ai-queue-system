import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-white/80 backdrop-blur dark:bg-black/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-9">
            <Image src="/file.svg" alt="TVET AI Queue System" fill className="object-contain" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              TVET AI Queue System
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              AI + Queue + Scheduling
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/requests/new"
            className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Submit Request
          </Link>
        </nav>
      </div>
    </header>
  );
}

