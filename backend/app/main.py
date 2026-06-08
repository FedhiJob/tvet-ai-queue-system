from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.init_db import init_db
from app.seed.seed_data import seed_data

from app.api.requests import router as requests_router


app = FastAPI(title="TVET AI Queue System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    # Create tables + ensure seed data exists.
    init_db()
    seed_data()


app.include_router(requests_router)


@app.get("/")

def root():
    return {
        "message": "TVET AI Queue System Backend is running"
    }
