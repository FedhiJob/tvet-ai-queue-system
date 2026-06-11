from __future__ import annotations

from datetime import datetime
import uuid

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.ai_prediction import AIPrediction
from app.models.request import Request
from app.models.service import Service

from app.services.priority_engine import (
    PriorityResult,
    compute_priority_result,
)


def compute_priority_and_wait(
    *,
    service: Service | None,
    is_urgent: bool,
    description: str,
    predicted_category: str | None,
) -> tuple[str, float, float]:
    """Phase 7 priority engine.

    - Uses capstone priority rules (based on predicted_category + is_urgent)
    - Produces: priority_level, priority_score, predicted_wait_minutes

    Note: we still accept `description` for potential future aging/rich rules.
    """

    avg = float(service.average_processing_time_minutes) if service else 5.0
    result: PriorityResult = compute_priority_result(
        average_processing_time_minutes=avg,
        predicted_category=predicted_category,
        is_urgent=is_urgent,
    )
    return result.priority_level, result.priority_score, result.predicted_wait_minutes





def create_request(db: Session, *, payload: "RequestCreateDTO") -> dict:
    """Create request + AI prediction placeholder, return API response dict."""

    # Resolve service
    service = db.query(Service).filter(Service.service_id == payload.service_type).first()
    if not service:
        # allow fallback by service_name during early dev
        service = db.query(Service).filter(Service.service_name == payload.service_type).first()

    if not service:
        raise HTTPException(status_code=400, detail="Unknown service_type")

    priority, priority_score, predicted_wait = compute_priority_and_wait(
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
    db.flush()

    ai = AIPrediction(
        request_id=req.id,
        category=service.service_name,
        confidence_score=0.50,
        predicted_priority_level=priority,
        predicted_wait_minutes=predicted_wait,
    )
    db.add(ai)

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


# Minimal DTO typing without importing pydantic models at runtime.
class RequestCreateDTO:
    service_type: str
    description: str
    is_urgent: bool
    student_name: str | None

