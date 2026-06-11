from __future__ import annotations

from fastapi import APIRouter

from app.database.session import SessionLocal
from app.database.init_db import init_db
from app.services.queue_service import get_queue, process_next

router = APIRouter(prefix="", tags=["queue"])


@router.get("/queue")
def queue_get():
    init_db()
    db = SessionLocal()
    try:
        return {"queue": get_queue(db)}
    finally:
        db.close()


@router.post("/queue/process-next")
def queue_process_next():
    init_db()
    db = SessionLocal()
    try:
        processed = process_next(db)
        return {"result": processed}
    finally:
        db.close()

