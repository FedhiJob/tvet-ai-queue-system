from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.request import Request


def get_request(db: Session, *, request_id: str) -> Request | None:
    return db.query(Request).filter(Request.request_id == request_id).first()

