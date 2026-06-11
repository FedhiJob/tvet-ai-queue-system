from __future__ import annotations

from dataclasses import dataclass
from typing import Tuple


PRIORITY_RULES = {
    # Phase 7 priority rules (capstone mapping)
    "Graduation Clearance": "High",
    "Transcript Urgent": "High",
    "Grade Appeal": "Medium",
    "ID Replacement": "Low",
}

PRIORITY_FACTOR = {
    # Phase 7 score calculation example mapping
    "High": 0.6,
    "Medium": 1.0,
    "Low": 1.4,
}


def normalize_text(text: str) -> str:
    return " ".join((text or "").strip().lower().split())


def infer_priority_level_from_category(*, predicted_category: str | None, is_urgent: bool) -> str:
    """Infer priority level from AI category + urgent flag.

    - If is_urgent is true, we treat it as "Transcript Urgent".
    - Otherwise we match the predicted_category against PRIORITY_RULES.
    """

    if is_urgent:
        # capstone rule: Transcript Urgent = High
        return "High"

    cat = (predicted_category or "").strip()
    for rule_cat, rule_priority in PRIORITY_RULES.items():
        if normalize_text(cat) == normalize_text(rule_cat):
            return rule_priority

    # default
    return "Medium"


def priority_score_from_level(level: str) -> float:
    """Phase 7 score calculation example.

    High = 1, Medium = 2, Low = 3
    """

    level = level or "Medium"
    return {"High": 1.0, "Medium": 2.0, "Low": 3.0}.get(level, 2.0)


def compute_predicted_wait_minutes(*, average_processing_time_minutes: float, level: str) -> float:
    """Compute predicted wait time factorized by priority.

    Phase 10 uses: queue_position * average_service_time. For Phase 7 we only
    set a deterministic wait estimate factor.
    """

    avg = float(average_processing_time_minutes or 0.0)
    factor = PRIORITY_FACTOR.get(level, 1.0)
    return avg * factor


@dataclass(frozen=True)
class PriorityResult:
    priority_level: str
    priority_score: float
    predicted_wait_minutes: float


def compute_priority(
    *,
    average_processing_time_minutes: float,
    predicted_category: str | None,
    is_urgent: bool,
) -> PriorityResult:
    raise NotImplementedError


def compute_priority_result(
    *,
    average_processing_time_minutes: float,
    predicted_category: str | None,
    is_urgent: bool,
) -> PriorityResult:
    level = infer_priority_level_from_category(
        predicted_category=predicted_category,
        is_urgent=is_urgent,
    )
    score = priority_score_from_level(level)
    predicted_wait = compute_predicted_wait_minutes(
        average_processing_time_minutes=average_processing_time_minutes,
        level=level,
    )
    return PriorityResult(
        priority_level=level,
        priority_score=score,
        predicted_wait_minutes=predicted_wait,
    )

