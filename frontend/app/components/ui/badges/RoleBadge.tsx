"use client";

type Role = string;

function roleStyles(role: Role) {
  const r = role.toLowerCase();
  if (r.includes("admin")) return "bg-[#0284c7]/15 text-[#0284C7] border-[#0284C7]";
  if (r.includes("staff")) return "bg-[#0f172a]/10 text-[#0F172A] border-[#E2E8F0]";
  if (r.includes("student")) return "bg-[#16a34a]/15 text-[#16A34A] border-[#16A34A]";
  return "bg-[#0f172a]/10 text-[#0F172A] border-[#E2E8F0]";
}

export default function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${roleStyles(
        role
      )}`}
    >
      {role}
    </span>
  );
}

