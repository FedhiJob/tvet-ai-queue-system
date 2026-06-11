from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.database.init_db import init_db
from app.database.session import SessionLocal
from app.schemas.request import RequestCreate, RequestResponse, RequestUpdate

from app.models.ai_prediction import AIPrediction
from app.models.request import Request

router = APIRouter(prefix="", tags=["requests"])


def get_db() -> Session:
    db = SessionLocal()
    try:
        return db
    finally:
        # NOTE: FastAPI will call this dependency per-request; closing after return is safe
        # only if using context manager pattern. For simplicity we manage in endpoints.
        pass


@router.post("/requests", response_model=RequestResponse)
def create_request(payload: RequestCreate):
    init_db()

    db: Session = SessionLocal()
    try:
        # Resolve service
        # For now, keep the existing placeholder logic by deriving priority from service defaults.
        # We avoid importing the whole older inline logic here; instead we reuse existing fields
        # computed at insert time from stored service/service_id.
        # Since current DB schema doesn't include service_id name mapping here, we reproduce
        # the earlier deterministic placeholder by looking up service via relationship-free query.

        # Import locally to avoid circular imports during startup
        from app.models.service import Service

        service: Service | None = (
            db.query(Service).filter(Service.service_id == payload.service_type).first()
        )
        if not service:
            service = db.query(Service).filter(Service.service_name == payload.service_type).first()
        if not service:
            raise HTTPException(status_code=400, detail="Unknown service_type")

        base = float(service.default_priority_score) if service else 3.0
        score = base + (2.0 if payload.is_urgent else 0.0)
        score += min(len(payload.description) / 500.0, 1.0)

        if score >= 4.5:
            priority = "High"
        elif score >= 3.5:
            priority = "Medium"
        else:
            priority = "Low"

        avg = float(service.average_processing_time_minutes) if service else 5.0
        factor = {"High": 0.6, "Medium": 1.0, "Low": 1.4}[priority]
        predicted_wait = avg * factor

        request_id = f"REQ-{__import__('datetime').datetime.utcnow().strftime('%Y')}-{__import__('uuid').uuid4().hex[:6].upper()}"

        req = Request(
            request_id=request_id,
            student_name=payload.student_name or "",
            service_type=service.service_id,
            description=payload.description,
            priority_level=priority,
            priority_score=score,
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

        return RequestResponse(
            request_id=req.request_id,
            student_name=req.student_name,
            service_type=req.service_type,
            description=req.description,
            priority_level=req.priority_level,
            priority_score=float(req.priority_score),
            predicted_wait_minutes=float(req.predicted_wait_minutes),
            queue_position=queue_position,
            status=None,
        )
    finally:
        db.close()


@router.get("/requests", response_model=list[RequestResponse])
def list_requests():
    init_db()
    db: Session = SessionLocal()
    try:
        rows = db.query(Request).order_by(Request.id.desc()).all()
        result: list[RequestResponse] = []
        for req in rows:
            # For now queue_position is optional; set to None.
            result.append(
                RequestResponse(
                    request_id=req.request_id,
                    student_name=req.student_name,
                    service_type=req.service_type,
                    description=req.description,
                    priority_level=req.priority_level,
                    priority_score=float(req.priority_score),
                    predicted_wait_minutes=float(req.predicted_wait_minutes),
                    queue_position=None,
                    status=None,
                )
            )
        return result
    finally:
        db.close()


@router.get("/requests/{request_id}", response_model=RequestResponse)
def get_request(request_id: str):
    init_db()
    db: Session = SessionLocal()
    try:
        req: Request | None = db.query(Request).filter(Request.request_id == request_id).first()
        if not req:
            raise HTTPException(status_code=404, detail="Request not found")

        return RequestResponse(
            request_id=req.request_id,
            student_name=req.student_name,
            service_type=req.service_type,
            description=req.description,
            priority_level=req.priority_level,
            priority_score=float(req.priority_score),
            predicted_wait_minutes=float(req.predicted_wait_minutes),
            queue_position=None,
            status=None,
        )
    finally:
        db.close()


@router.put("/requests/{request_id}", response_model=RequestResponse)
def update_request(request_id: str, payload: RequestUpdate):
    init_db()
    db: Session = SessionLocal()
    try:
        req: Request | None = db.query(Request).filter(Request.request_id == request_id).first()
        if not req:
            raise HTTPException(status_code=404, detail="Request not found")

        if payload.description is not None:
            req.description = payload.description
        if payload.priority_level is not None:
            req.priority_level = payload.priority_level

        # If priority_level changed, recompute score/wait deterministically could be added later.

        db.commit()
        db.refresh(req)

        return RequestResponse(
            request_id=req.request_id,
            student_name=req.student_name,
            service_type=req.service_type,
            description=req.description,
            priority_level=req.priority_level,
            priority_score=float(req.priority_score),
            predicted_wait_minutes=float(req.predicted_wait_minutes),
            queue_position=None,
            status=None,
        )
    finally:
        db.close()

