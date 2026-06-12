"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar, { type SearchBarValue } from "@/app/components/search/SearchBar";
import EmptyState from "@/app/components/ui/feedback/EmptyState";
import StatusBadge from "@/app/components/ui/badges/StatusBadge";
import PriorityBadge from "@/app/components/ui/badges/PriorityBadge";
import TableSkeleton from "@/app/components/ui/loading/TableSkeleton";

import { listRequests, type ListRequestItem } from "@/app/services/request.service";

function matchesQuery(item: ListRequestItem, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    item.request_id.toLowerCase().includes(q) ||
    item.student_name.toLowerCase().includes(q) ||
    item.service_type.toLowerCase().includes(q)
  );
}

export default function MyRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ListRequestItem[]>([]);

  const [search, setSearch] = useState<SearchBarValue>({
    query: "",
    status: "all",
  });

  useEffect(() => {
    let mounted = true;

    listRequests()
      .then((res) => {
        if (!mounted) return;
        setItems(res);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load requests");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);


  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (!matchesQuery(it, search.query)) return false;

      // Backend currently returns status=null for all items, so status filtering is a no-op.
      if (search.status === "all") return true;

      const st = (it.status ?? "").toLowerCase();
      if (!st) return false;

      if (search.status === "pending") return st.includes("pending");
      if (search.status === "in_progress") return st.includes("in progress") || st.includes("processing");
      if (search.status === "approved") return st.includes("approved") || st.includes("completed") || st.includes("done");
      if (search.status === "rejected") return st.includes("rejected") || st.includes("failed");
      return true;
    });
  }, [items, search.query, search.status]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A]">My Requests</h1>
        <p className="mt-1 text-sm text-[#475569]">Track your registrar submissions and priority.</p>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No requests found" description="Try resetting the filters." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
          <div className="grid grid-cols-12 gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-xs font-semibold text-[#475569]">
            <span className="col-span-3">Request</span>
            <span className="col-span-3">Student</span>
            <span className="col-span-2">Service</span>
            <span className="col-span-2">Priority</span>
            <span className="col-span-2">Status</span>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {filtered.map((it) => (
              <div
                key={it.request_id}
                className="grid grid-cols-12 gap-2 px-4 py-3 text-sm"
              >
                <div className="col-span-3 font-semibold text-[#0F172A]">{it.request_id}</div>
                <div className="col-span-3 text-[#334155]">{it.student_name}</div>
                <div className="col-span-2 text-[#334155]">{it.service_type}</div>
                <div className="col-span-2">
                  <PriorityBadge priority={it.priority_level} />
                </div>
                <div className="col-span-2 flex items-center">
                  {it.status ? (
                    <StatusBadge status={it.status} />
                  ) : (
                    <span className="text-xs text-[#64748B]">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

