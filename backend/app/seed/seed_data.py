from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.staff import Staff
from app.models.service import Service


def seed_data(db: Session | None = None) -> None:
    created_session = False
    if db is None:
        db = SessionLocal()
        created_session = True

    try:
        # Staff seed
        staff_rows = [
            {"staff_id": "OFFICER-A", "name": "Registrar Officer A", "daily_capacity": 20},
            {"staff_id": "OFFICER-B", "name": "Registrar Officer B", "daily_capacity": 20},
            {"staff_id": "OFFICER-C", "name": "Registrar Officer C", "daily_capacity": 20},
        ]

        for row in staff_rows:
            existing = db.query(Staff).filter(Staff.staff_id == row["staff_id"]).first()
            if not existing:
                db.add(
                    Staff(
                        staff_id=row["staff_id"],
                        name=row["name"],
                        role="staff",
                        daily_capacity=row["daily_capacity"],
                    )
                )

        # Services seed
        services_rows = [
            {"service_id": "SRV-TRANSCRIPT", "service_name": "Transcript Request", "average_processing_time_minutes": 5.0},
            {"service_id": "SRV-ID-REPLACEMENT", "service_name": "ID Replacement", "average_processing_time_minutes": 4.0},
            {"service_id": "SRV-GRADE-APPEAL", "service_name": "Grade Appeal", "average_processing_time_minutes": 7.0},
            {"service_id": "SRV-REG-CORRECTION", "service_name": "Registration Issue", "average_processing_time_minutes": 6.0},
            {"service_id": "SRV-GRAD-CLEARANCE", "service_name": "Graduation Clearance", "average_processing_time_minutes": 8.0},
            {"service_id": "SRV-DOC-VERIFICATION", "service_name": "Document Verification", "average_processing_time_minutes": 4.5},
        ]

        for row in services_rows:
            existing = db.query(Service).filter(Service.service_id == row["service_id"]).first()
            if not existing:
                db.add(
                    Service(
                        service_id=row["service_id"],
                        service_name=row["service_name"],
                        average_processing_time_minutes=row["average_processing_time_minutes"],
                        default_priority_score=3.0,
                    )
                )

        db.commit()
    finally:
        if created_session:
            db.close()

