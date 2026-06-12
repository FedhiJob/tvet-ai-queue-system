const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type Priority = "High" | "Medium" | "Low";

export type CreateRequestDto = {
  service_type: string;
  description: string;
  is_urgent: boolean;
  student_name?: string;
};

export type CreateRequestResponse = {
  request_id: string;
  priority: Priority;
  queue_position: number;
  predicted_wait_minutes: number;
};

export async function createRequest(payload: CreateRequestDto): Promise<CreateRequestResponse> {
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

export type ListRequestItem = {
  request_id: string;
  student_name: string;
  service_type: string;
  description: string;
  priority_level: string;
  priority_score: number;
  predicted_wait_minutes: number;
  queue_position?: number | null;
  status?: string | null;
};

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


