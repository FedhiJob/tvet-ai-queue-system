const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

import type { CreateRequestDto, CreateRequestResponse, ListRequestItem } from "@/app/types/request";

export async function createRequest(
  payload: CreateRequestDto
): Promise<CreateRequestResponse> {
  const res = await fetch(`${API_BASE_URL}/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let detail: string | undefined;
    try {
      const json = await res.json();
      detail = json?.detail;
    } catch {
      // ignore
    }
    throw new Error(detail ?? text ?? `Request failed (${res.status})`);
  }

  return (await res.json()) as CreateRequestResponse;
}

export async function listRequests(): Promise<ListRequestItem[]> {
  const res = await fetch(`${API_BASE_URL}/requests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let detail: string | undefined;
    try {
      const json = await res.json();
      detail = json?.detail;
    } catch {
      // ignore
    }
    throw new Error(detail ?? text ?? `Requests fetch failed (${res.status})`);
  }

  return (await res.json()) as ListRequestItem[];
}

