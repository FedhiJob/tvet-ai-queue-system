from __future__ import annotations

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.database.init_db import init_db
from app.database.session import SessionLocal
from app.models.request import Request

router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.get("/wait-time/{request_id}")
def wait_time(request_id: str):
    init_db()

    db: Session = SessionLocal()
    try:
        req: Request | None = db.query(Request).filter(Request.request_id == request_id).first()
        if not req:
            raise HTTPException(status_code=404, detail="Request not found")

        return {
            "request_id": req.request_id,
            "predicted_wait_minutes": float(req.predicted_wait_minutes),
        }
    finally:
        db.close()

