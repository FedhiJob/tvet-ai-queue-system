# Re-export models to ensure SQLAlchemy metadata registration.

from app.models.staff import Staff
from app.models.service import Service
from app.models.user import User
from app.models.request import Request
from app.models.appointment import Appointment
from app.models.ai_prediction import AIPrediction

