export type RequestStatus =
  | "pending"
  | "in_progress"
  | "approved"
  | "rejected";

export type PriorityLevel = "low" | "medium" | "high" | "urgent";

export type CreateRequestDto = {
  service_type: string;
  description: string;
  is_urgent: boolean;
  student_name?: string;
};

export type CreateRequestResponse = {
  request_id: string;
  priority: string;
  queue_position: number;
  predicted_wait_minutes: number;
};

export type ListRequestItem = {
  request_id: string;
  student_name: string;
  service_type: string;
  priority_level: PriorityLevel;
  status?: string | null;
  created_at?: string;
  queue_position?: number;
};

