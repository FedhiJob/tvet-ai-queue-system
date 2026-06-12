import Link from "next/link";
import { usePathname } from "next/navigation";

const items: Array<{ href: string; label: string }> = [
  { href: "/requests/new", label: "New Request" },
  { href: "/requests", label: "My Requests" },
  { href: "/queue", label: "Queue" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white px-4 py-6 md:block">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Student
      </div>
      <div className="mt-4 space-y-2">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={
                active
                  ? "block rounded-lg bg-[#2563EB]/10 px-3 py-2 text-sm font-semibold text-[#2563EB]"
                  : "block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              }
            >
              {it.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

