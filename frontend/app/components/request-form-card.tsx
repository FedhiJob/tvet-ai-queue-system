"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createRequest } from "@/app/services/request.service";
import type { CreateRequestDto } from "@/app/types/request";

type Priority = "High" | "Medium" | "Low";

function StatusPill({
  priority,
}: {
  priority: Priority;
}) {
  const cls =
    priority === "High"
      ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-700/10"
      : priority === "Medium"
        ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-700/10"
        : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
    >
      Priority: {priority}
    </span>
  );
}

export default function RequestFormCard() {
  const router = useRouter();
  const [form, setForm] = useState<CreateRequestDto>({
    service_type: "",
    description: "",
    is_urgent: false,
    student_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<
    | null
    | {
        request_id: string;
        priority: Priority;
        queue_position: number;
        predicted_wait_minutes: number;
      }
  >(null);

  const canSubmit = form.service_type.trim().length > 0 && form.description.trim().length >= 10;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await createRequest(form);
      setResult(res);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError(String((err as { message?: unknown }).message ?? "Failed to create request"));
      } else {
        setError("Failed to create request");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      {!result ? (
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Service Type */}
          <div>
            <label className="text-sm font-medium text-[#0F172A]">Service Type</label>
            <p className="mt-1 text-xs text-[#475569]">
              Use the registrar service identifier (e.g., SRV-TRANSCRIPT).
            </p>
            <select
              required
              value={form.service_type}
              onChange={(e) => setForm((s) => ({ ...s, service_type: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
            >
              <option value="">Select a service</option>
              <option value="SRV-TRANSCRIPT">Transcript Request</option>
              <option value="SRV-ID-REPLACEMENT">ID Replacement</option>
              <option value="SRV-GRADE-APPEAL">Grade Appeal</option>
              <option value="SRV-REG-CORRECTION">Registration Issue</option>
              <option value="SRV-GRAD-CLEARANCE">Graduation Clearance</option>
              <option value="SRV-DOC-VERIFICATION">Document Verification</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-[#0F172A]">Description</label>
            <p className="mt-1 text-xs text-[#475569]">
              Minimum 10 characters. Provide clear details for administrative processing.
            </p>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              rows={5}
              className="mt-2 w-full resize-none rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
              placeholder="Describe your request..."
            />
          </div>

          {/* Single-column form philosophy */}
          <div>
            <label className="text-sm font-medium text-[#0F172A]">Student Name (optional)</label>
            <input
              value={form.student_name ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, student_name: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
              placeholder="e.g., John Doe"
            />
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <label className="text-sm font-medium text-[#0F172A]">Urgent Request</label>
                <p className="mt-1 text-xs text-[#475569]">Mark if time-sensitive.</p>
              </div>
              <input
                type="checkbox"
                checked={form.is_urgent}
                onChange={(e) => setForm((s) => ({ ...s, is_urgent: e.target.checked }))}
                className="h-4 w-4 accent-[#2563EB]"
                aria-label="Urgent request"
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-[#DC2626]/20 bg-[#DC2626]/5 px-3 py-2 text-sm text-[#DC2626]">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="inline-flex items-center justify-center rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting…" : "Create Request"}
            </button>

            <button
              type="button"
              onClick={() => {
                setForm({ service_type: "", description: "", is_urgent: false, student_name: "" });
                setError(null);
                setResult(null);
              }}
              className="text-sm font-semibold text-[#0F172A] hover:text-[#2563EB]"
            >
              Reset
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-[#2563EB]/10 px-3 py-1 text-xs font-semibold text-[#2563EB] ring-1 ring-inset ring-[#2563EB]/20">
                ✓ Request Created
              </span>
              <StatusPill priority={result.priority} />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-[#0F172A]">
              Request ID: {result.request_id}
            </h2>
            <p className="mt-1 text-sm text-[#475569]">
              Queue position:{" "}
              <span className="font-semibold text-[#0F172A]">{result.queue_position}</span>
            </p>
            <p className="mt-1 text-sm text-[#475569]">
              Estimated wait:{" "}
              <span className="font-semibold text-[#0F172A]">{result.predicted_wait_minutes.toFixed(0)}</span> minutes
            </p>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <p className="text-sm font-semibold text-[#0F172A]">Next Steps</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-[#475569]">
              <li>Monitor your request status in the Requests page.</li>
              <li>Arrive at the scheduled appointment time (15-minute slots).</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/requests")}
              className="inline-flex items-center justify-center rounded-full bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2563EB]"
            >
              Go to My Requests
            </button>
            <button
              type="button"
              onClick={() => {
                setResult(null);
              }}
              className="inline-flex items-center justify-center rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
            >
              Submit another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

