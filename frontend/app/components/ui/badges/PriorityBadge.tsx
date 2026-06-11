"use client";

type Priority = "low" | "medium" | "high" | string;

function priorityStyles(priority: Priority) {
  const p = priority.toLowerCase();
  if (p.includes("high")) return "bg-[#dc2626]/15 text-[#DC2626] border-[#DC2626]";
  if (p.includes("medium"))
    return "bg-[#d97706]/15 text-[#D97706] border-[#D97706]";
  if (p.includes("low")) return "bg-[#16a34a]/15 text-[#16A34A] border-[#16A34A]";
  return "bg-[#0f172a]/10 text-[#0F172A] border-[#E2E8F0]";
}

export default function PriorityBadge({
  priority,
}: {
  priority: Priority;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${priorityStyles(
        priority
      )}`}
    >
      {priority}
    </span>
  );
}

