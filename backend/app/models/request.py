from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Request(Base):
    __tablename__ = "requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    request_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)

    student_name: Mapped[str] = mapped_column(String(255), default="")
    service_type: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(2000), default="")

    priority_level: Mapped[str] = mapped_column(String(16), default="Medium")
    priority_score: Mapped[float] = mapped_column(Float, default=2.0)

    predicted_wait_minutes: Mapped[float] = mapped_column(Float, default=0.0)

