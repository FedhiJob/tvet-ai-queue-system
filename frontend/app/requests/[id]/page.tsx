"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import AuthGuard from "@/app/components/auth/AuthGuard";
import EmptyState from "@/app/components/ui/feedback/EmptyState";
import TableSkeleton from "@/app/components/ui/loading/TableSkeleton";

import type { RequestStatus } from "@/app/types/request";
import { listRequests } from "@/app/services/request.service";
import type { ListRequestItem } from "@/app/types/request";


function RequestTimeline({ status }: { status?: RequestStatus | string | null }) {
  const normalized = (status ?? "").toString().toLowerCase();

  const steps: Array<{ label: string; done: boolean; hint: string }> = [
    {
      label: "Submitted",
      done: !!normalized,
      hint: "Request created and stored.",
    },
    {
      label: "Classified",
      done: normalized !== "" && !normalized.includes("rejected"),
      hint: "AI classification + priority computed.",
    },
    {
      label: "Queued",
      done: normalized !== "" && !normalized.includes("rejected"),
      hint: "Your position in the queue is determined.",
    },
    {
      label: "Completed",
      done: normalized.includes("approved") || normalized.includes("completed") || normalized.includes("done"),
      hint: "Request finished.",
    },
  ];

  return (
    <div className="space-y-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
      <h3 className="text-sm font-semibold text-[#0F172A]">Request Timeline</h3>
      <ol className="space-y-3">
        {steps.map((s) => (
          <li key={s.label} className="flex gap-3">
            <div
              className={
                s.done
                  ? "mt-0.5 h-6 w-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold"
                  : "mt-0.5 h-6 w-6 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center text-xs font-bold"
              }
            >
              {s.done ? "✓" : "•"}
            </div>
            <div>
              <div className="text-sm font-medium text-[#0F172A]">{s.label}</div>
              <div className="text-xs text-[#475569]">{s.hint}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function RequestDetailsPage() {
  const params = useParams<{ id: string }>();
  const requestId = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<ListRequestItem | null>(null);

  useEffect(() => {
    if (!requestId) return;

    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      setItem(null);

      // Backend has GET /requests/{request_id}; current frontend service doesn't expose it yet,
      // so we fall back to listing and finding by id.
      try {
        const res = await listRequests();
        if (!mounted) return;
        const found = res.find((r) => r.request_id === requestId) ?? null;
        setItem(found);
      } catch (e: unknown) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load request details");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [requestId]);


  return (
    <AuthGuard>
      <div className="mx-auto max-w-5xl space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A]">Request Details</h1>
          <p className="mt-1 text-sm text-[#475569]">Tracking ID and timeline for your submission.</p>
        </div>

        {loading ? (
          <TableSkeleton rows={6} />
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : !item ? (
          <EmptyState title="Request not found" description="The request id may be invalid." />
        ) : (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-7 space-y-4">
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-xs text-[#64748B]">Request ID</div>
                    <div className="text-sm font-semibold text-[#0F172A]">{item.request_id}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#64748B]">Service</div>
                    <div className="text-sm font-semibold text-[#0F172A]">{item.service_type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#64748B]">Student</div>
                    <div className="text-sm font-semibold text-[#0F172A]">{item.student_name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#64748B]">Priority</div>
                    <div className="text-sm font-semibold text-[#0F172A]">{item.priority_level}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs text-[#64748B]">Queue Position</div>
                  <div className="text-sm font-semibold text-[#0F172A]">
                    {typeof item.queue_position === "number" ? item.queue_position : "—"}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
                <h2 className="text-sm font-semibold text-[#0F172A]">Description</h2>
                <p className="mt-2 text-sm text-[#475569]">
                  The request description is stored on the backend, but the current list endpoint doesn't return it.
                </p>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 space-y-4">
              <RequestTimeline status={item.status ?? null} />

              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                <h3 className="text-sm font-semibold text-[#0F172A]">Estimated Wait</h3>
                <p className="mt-1 text-sm text-[#475569]">
                  Available after prediction: <span className="font-semibold text-[#0F172A]">{"—"}</span> minutes
                </p>

              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

