from typing import Optional

from pydantic import BaseModel, Field


class RequestCreate(BaseModel):
    service_type: str = Field(..., min_length=1)
    description: str = Field(..., min_length=10)
    is_urgent: bool = False
    student_name: Optional[str] = ""


class RequestUpdate(BaseModel):
    status: Optional[str] = None
    description: Optional[str] = None
    priority_level: Optional[str] = None


class RequestResponse(BaseModel):
    request_id: str
    student_name: str
    service_type: str
    description: str

    priority_level: str
    priority_score: float

    predicted_wait_minutes: float
    queue_position: Optional[int] = None
    status: Optional[str] = None

