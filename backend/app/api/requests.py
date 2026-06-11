from datetime import datetime
import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from sqlalchemy.orm import Session

from app.database.init_db import init_db
from app.database.session import SessionLocal
from app.models.ai_prediction import AIPrediction
from app.models.request import Request
from app.models.service import Service


router = APIRouter(prefix="", tags=["requests"])


class CreateRequestBody(BaseModel):
    service_type: str = Field(..., min_length=1)
    description: str = Field(..., min_length=10)
    is_urgent: bool = False
    student_name: str | None = ""


def _compute_priority_and_wait(*, service: Service | None, is_urgent: bool, description: str) -> tuple[str, float, float]:
    """Minimal deterministic placeholder logic until full AI wiring is done.

    Returns: (priority_level, priority_score, predicted_wait_minutes)
    """
    # Use service default priority score as base.
    base = float(service.default_priority_score) if service else 3.0

    # Urgent bumps priority score.
    score = base + (2.0 if is_urgent else 0.0)

    # Description length adds slight signal (still deterministic).
    score += min(len(description) / 500.0, 1.0)

    if score >= 4.5:
        priority = "High"
    elif score >= 3.5:
        priority = "Medium"
    else:
        priority = "Low"

    # Predicted wait: map priority inversely + service average time.
    avg = float(service.average_processing_time_minutes) if service else 5.0
    factor = {"High": 0.6, "Medium": 1.0, "Low": 1.4}[priority]
    predicted_wait = avg * factor
    return priority, score, predicted_wait


@router.post("/requests")
def create_request(payload: CreateRequestBody):
    # Ensure DB tables exist.
    init_db()

    db: Session = SessionLocal()
    try:
        service = db.query(Service).filter(Service.service_id == payload.service_type).first()

        if not service:
            # Allow service_name as fallback for early dev.
            service = db.query(Service).filter(Service.service_name == payload.service_type).first()

        if not service:
            raise HTTPException(status_code=400, detail="Unknown service_type")

        priority, priority_score, predicted_wait = _compute_priority_and_wait(
            service=service,
            is_urgent=payload.is_urgent,
            description=payload.description,
        )

        request_id = f"REQ-{datetime.utcnow().strftime('%Y')}-{uuid.uuid4().hex[:6].upper()}"

        req = Request(
            request_id=request_id,
            student_name=payload.student_name or "",
            service_type=service.service_id,
            description=payload.description,
            priority_level=priority,
            priority_score=priority_score,
            predicted_wait_minutes=predicted_wait,
        )

        db.add(req)
        db.flush()  # get req.id

        # Create AI prediction record (placeholder until ML integration).
        ai = AIPrediction(
            request_id=req.id,
            category=service.service_name,
            confidence_score=0.50,
            predicted_priority_level=priority,
            predicted_wait_minutes=predicted_wait,
        )
        db.add(ai)

        # Queue position: basic approximation.
        # Future: replace with actual priority queue ordering.
        queue_position = (
            db.query(Request)
            .filter(Request.id <= req.id)
            .order_by(Request.priority_score.desc(), Request.id.asc())
            .count()
        )

        db.commit()

        return {
            "request_id": req.request_id,
            "priority": req.priority_level,
            "queue_position": queue_position,
            "predicted_wait_minutes": req.predicted_wait_minutes,
        }
    finally:
        db.close()

