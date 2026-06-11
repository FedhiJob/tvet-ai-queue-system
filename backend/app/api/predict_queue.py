from __future__ import annotations

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.database.init_db import init_db
from app.database.session import SessionLocal
from app.models.request import Request

router = APIRouter(prefix="/queue", tags=["queue-prediction"])


@router.get("/predict-next")
def predict_next():
    """Phase 11: Predict next request to be processed.

    Uses current queue ordering (priority_score ASC then id ASC) and returns
    the next request along with predicted_wait_minutes.
    """

    init_db()
    db: Session = SessionLocal()
    try:
        # Ordering consistent with queue_service._compute_queue_order
        req: Request | None = (
            db.query(Request)
            .order_by(Request.priority_score.asc(), Request.id.asc())
            .first()
        )
        if not req:
            return {"next_request": None}

        return {
            "next_request": {
                "request_id": req.request_id,
                "student_name": req.student_name,
                "service_type": req.service_type,
                "priority_level": req.priority_level,
                "priority_score": float(req.priority_score),
                "predicted_wait_minutes": float(req.predicted_wait_minutes),
            }
        }
    finally:
        db.close()

