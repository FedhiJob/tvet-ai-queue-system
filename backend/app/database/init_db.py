from app.database.session import engine
from app.database.base import Base


def init_db() -> None:
    # Import models so they are registered with SQLAlchemy's metadata
    from app.models import staff, service, user, request, appointment, ai_prediction  # noqa: F401

    Base.metadata.create_all(bind=engine)

