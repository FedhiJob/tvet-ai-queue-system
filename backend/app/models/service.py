from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    service_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    service_name: Mapped[str] = mapped_column(String(255))
    average_processing_time_minutes: Mapped[float] = mapped_column(Float, default=5.0)

    default_priority_score: Mapped[float] = mapped_column(Float, default=3.0)

