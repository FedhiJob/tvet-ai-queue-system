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
    } catch (err: any) {
      setError(err?.message ?? "Failed to create request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {!result ? (
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-900">Service Type</label>
            <p className="mt-1 text-xs text-slate-600">
              Use the registrar service identifier (e.g., SRV-TRANSCRIPT).
            </p>
            <select
              required
              value={form.service_type}
              onChange={(e) => setForm((s) => ({ ...s, service_type: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
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

          <div>
            <label className="text-sm font-medium text-slate-900">Description</label>
            <p className="mt-1 text-xs text-slate-600">
              Minimum 10 characters. Provide clear details for administrative processing.
            </p>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              rows={5}
              className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
              placeholder="Describe your request..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-900">Student Name (optional)</label>
              <input
                value={form.student_name ?? ""}
                onChange={(e) => setForm((s) => ({ ...s, student_name: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                placeholder="e.g., John Doe"
              />
            </div>

            <div className="flex items-end justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div>
                <label className="text-sm font-medium text-slate-900">Urgent Request</label>
                <p className="mt-1 text-xs text-slate-600">Mark if time-sensitive.</p>
              </div>
              <input
                type="checkbox"
                checked={form.is_urgent}
                onChange={(e) => setForm((s) => ({ ...s, is_urgent: e.target.checked }))}
                className="h-4 w-4 accent-blue-600"
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
              className="text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              Reset
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                ✓ Request Created
              </span>
              <StatusPill priority={result.priority} />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">Request ID: {result.request_id}</h2>
            <p className="mt-1 text-sm text-slate-600">
              Queue position: <span className="font-semibold text-slate-900">{result.queue_position}</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Estimated wait: <span className="font-semibold text-slate-900">{result.predicted_wait_minutes.toFixed(0)}</span> minutes
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Next Steps</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
              <li>Monitor your request status in the Requests page.</li>
              <li>Arrive at the scheduled appointment time (15-minute slots).</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/requests")}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Go to My Requests
            </button>
            <button
              type="button"
              onClick={() => {
                setResult(null);
              }}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Submit another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

