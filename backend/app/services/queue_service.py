from __future__ import annotations

import heapq
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Optional

from sqlalchemy.orm import Session

from app.models.request import Request


@dataclass(frozen=True)
class QueueItem:
    """Item stored in heapq.

    We want highest priority first.
    In this project:
      - High priority should be processed before Medium before Low.
      - Request.priority_score uses High=1, Medium=2, Low=3 (lower score = higher priority)

    So our heap key is:
      (priority_score ASC, id ASC)

    Note: Request.id is an autoincrement PK.
    """

    priority_score: float
    request_db_id: int
    request_request_id: str


PRIORITY_SORT_HINT = {
    "High": 1.0,
    "Medium": 2.0,
    "Low": 3.0,
}


def _build_heap(db: Session) -> list[QueueItem]:
    # Only consider requests that have not been completed.
    # Current schema for Request does not include status column.
    # We'll treat anything with priority_level present as active.
    rows = db.query(Request).order_by(Request.id.asc()).all()

    heap: list[QueueItem] = []
    for r in rows:
        pr = float(r.priority_score) if r.priority_score is not None else PRIORITY_SORT_HINT.get(r.priority_level, 2.0)
        heap.append(
            QueueItem(
                priority_score=pr,
                request_db_id=int(r.id),
                request_request_id=r.request_id,
            )
        )

    heapq.heapify(heap)
    return heap


def _compute_queue_order(db: Session) -> list[Request]:
    # Highest priority first: lower priority_score first; tie-breaker: earlier db id first.
    return (
        db.query(Request)
        .order_by(Request.priority_score.asc(), Request.id.asc())
        .all()
    )


def get_queue(db: Session) -> list[dict[str, Any]]:
    """Return queue items with positions."""

    ordered = _compute_queue_order(db)
    out: list[dict[str, Any]] = []
    for idx, req in enumerate(ordered, start=1):
        out.append(
            {
                "queue_position": idx,
                "request_id": req.request_id,
                "student_name": req.student_name,
                "service_type": req.service_type,
                "priority_level": req.priority_level,
                "priority_score": float(req.priority_score),
                "predicted_wait_minutes": float(req.predicted_wait_minutes),
            }
        )
    return out


def process_next(db: Session) -> Optional[dict[str, Any]]:
    """Pop next request from heap ordering and update status if schema supports it.

    Current Request model in this repo does NOT include `status`, so we cannot update.
    Still, we will return the next request according to ordering.
    """

    heap = _build_heap(db)
    if not heap:
        return None

    item = heapq.heappop(heap)
    req = db.query(Request).filter(Request.request_id == item.request_request_id).first()
    if not req:
        return None

    # If in future Request.status exists, update here.
    # If not, we do nothing.

    return {
        "processed": True,
        "request_id": req.request_id,
        "queue_position": None,  # caller can recompute if needed
        "priority_level": req.priority_level,
        "priority_score": float(req.priority_score),
        "predicted_wait_minutes": float(req.predicted_wait_minutes),
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }

