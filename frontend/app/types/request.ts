export interface CreateRequestDto {
  service_type: string;
  description: string;
  is_urgent: boolean;
  student_name?: string;
}

