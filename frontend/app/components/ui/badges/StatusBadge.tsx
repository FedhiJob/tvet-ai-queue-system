"use client";

type Status = string;

function statusStyles(status: Status) {
  const s = status.toLowerCase();
  if (s.includes("pending")) return "bg-[#d97706]/15 text-[#D97706] border-[#D97706]";
  if (s.includes("approved") || s.includes("completed") || s.includes("done")) {
    return "bg-[#16a34a]/15 text-[#16A34A] border-[#16A34A]";
  }
  if (s.includes("rejected") || s.includes("failed")) {
    return "bg-[#dc2626]/15 text-[#DC2626] border-[#DC2626]";
  }
  if (s.includes("processing") || s.includes("in progress")) {
    return "bg-[#0284c7]/15 text-[#0284C7] border-[#0284C7]";
  }
  return "bg-[#0f172a]/10 text-[#0F172A] border-[#E2E8F0]";
}

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles(
        status
      )}`}
    >
      {status}
    </span>
  );
}

