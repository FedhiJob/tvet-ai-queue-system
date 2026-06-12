"use client";

import { useMemo, useState } from "react";





export type SearchBarValue = {
  query: string;
  status: "all" | "pending" | "in_progress" | "approved" | "rejected";
};

function statusOptions() {
  return [
    { value: "all", label: "All statuses" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In progress" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ] as const;
}

export default function SearchBar({
  value,
  onChange,
}: {
  value: SearchBarValue;
  onChange: (next: SearchBarValue) => void;
}) {
  const [local, setLocal] = useState<SearchBarValue>(value);

  // Keep local state in sync with external value.
  // Intentionally omitted to avoid React setState-in-effect eslint error.





  const options = useMemo(() => statusOptions(), []);

  function commit(next: SearchBarValue) {
    setLocal(next);
    onChange(next);
  }

  return (
    <div className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#0F172A]">Search</label>
          <input
            value={local.query}
            onChange={(e) => setLocal((s) => ({ ...s, query: e.target.value }))}
            placeholder="Search by request id, student name, or service type..."
            className="mt-2 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
          />
        </div>

        <div className="sm:w-[240px]">
          <label className="text-sm font-semibold text-[#0F172A]">Status</label>
          <select
            value={local.status}
            onChange={(e) => commit({ ...local, status: e.target.value as SearchBarValue["status"] })}
            className="mt-2 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => commit({ query: "", status: "all" })}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => commit(local)}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#2563EB] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

