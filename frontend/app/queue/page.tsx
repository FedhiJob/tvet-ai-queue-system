"use client";

import { useEffect, useState } from "react";

import SearchBar, { type SearchBarValue } from "@/app/components/search/SearchBar";
import EmptyState from "@/app/components/ui/feedback/EmptyState";
import TableSkeleton from "@/app/components/ui/loading/TableSkeleton";

import { getQueue, type QueueItem } from "@/app/services/queue.service";

export default function QueueMonitorPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);

  useEffect(() => {
    let mounted = true;

    getQueue()
      .then((res) => {
        if (!mounted) return;
        setQueue(res);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load queue");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A]">Queue Monitor</h1>
        <p className="mt-1 text-sm text-[#475569]">Priority ordered queue for request processing.</p>
      </div>

      {/* SearchBar is currently designed for request statuses; queue items don’t expose status.
          Keep the UI consistent but don’t apply filters for now. */}
      <SearchBar
        value={{ query: "", status: "all" } satisfies SearchBarValue}
        onChange={() => {
          // no-op
        }}
      />

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : queue.length === 0 ? (
        <EmptyState title="Queue is empty" description="No requests are currently waiting." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
          <div className="grid grid-cols-12 gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-xs font-semibold text-[#475569]">
            <span className="col-span-2">Pos</span>
            <span className="col-span-3">Request</span>
            <span className="col-span-3">Student</span>
            <span className="col-span-2">Priority</span>
            <span className="col-span-2">Wait</span>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {queue.map((it) => (
              <div key={it.request_id} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm">
                <div className="col-span-2 font-semibold text-[#0F172A]">{it.queue_position}</div>
                <div className="col-span-3 font-semibold text-[#0F172A]">{it.request_id}</div>
                <div className="col-span-3 text-[#334155]">{it.student_name}</div>
                <div className="col-span-2 text-[#334155]">{it.priority_level}</div>
                <div className="col-span-2 text-[#334155]">{Math.round(it.predicted_wait_minutes)} min</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

