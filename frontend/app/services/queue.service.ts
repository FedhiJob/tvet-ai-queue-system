const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type QueueItem = {
  queue_position: number;
  request_id: string;
  student_name: string;
  service_type: string;
  priority_level: string;
  priority_score: number;
  predicted_wait_minutes: number;
};

export type QueueResponse = {
  queue: QueueItem[];
};

export async function getQueue(): Promise<QueueItem[]> {
  const res = await fetch(`${API_BASE_URL}/queue`, {
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
    throw new Error(detail ?? text ?? `Queue fetch failed (${res.status})`);
  }

  const data = (await res.json()) as QueueResponse;
  return data.queue;
}

