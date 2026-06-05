from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from app.database.base import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    appointment_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)

    staff_id: Mapped[int] = mapped_column(ForeignKey("staff.id"))
    request_id: Mapped[int] = mapped_column(ForeignKey("requests.id"))

    appointment_datetime: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    status: Mapped[str] = mapped_column(String(32), default="scheduled")

