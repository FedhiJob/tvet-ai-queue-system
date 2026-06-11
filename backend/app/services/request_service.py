from __future__ import annotations

from datetime import datetime
import uuid

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.ai_prediction import AIPrediction
from app.models.request import Request
from app.models.service import Service


def compute_priority_and_wait(*, service: Service | None, is_urgent: bool, description: str) -> tuple[str, float, float]:
    """Deterministic placeholder logic until full AI wiring is done."""

    base = float(service.default_priority_score) if service else 3.0

    score = base + (2.0 if is_urgent else 0.0)

    score += min(len(description) / 500.0, 1.0)

    if score >= 4.5:
        priority = "High"
    elif score >= 3.5:
        priority = "Medium"
    else:
        priority = "Low"

    avg = float(service.average_processing_time_minutes) if service else 5.0
    factor = {"High": 0.6, "Medium": 1.0, "Low": 1.4}[priority]
    predicted_wait = avg * factor

    return priority, score, predicted_wait


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

