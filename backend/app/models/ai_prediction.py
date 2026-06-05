from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    request_id: Mapped[int] = mapped_column(Integer, index=True, unique=True)

    category: Mapped[str] = mapped_column(String(128))
    confidence_score: Mapped[float] = mapped_column(Float)

    predicted_priority_level: Mapped[str] = mapped_column(String(16), default="Medium")
    predicted_wait_minutes: Mapped[float] = mapped_column(Float, default=0.0)

