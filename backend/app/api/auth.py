from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.auth import create_access_token, create_refresh_token, hash_password, verify_password
from app.database.session import SessionLocal
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


def get_db() -> Session:
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()


class RegisterBody(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)
    role: str = Field(default="student")


class LoginBody(BaseModel):
    email: str
    password: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshBody(BaseModel):
    refresh_token: str


@router.post("/register", response_model=TokenPair)
def register(payload: RegisterBody):
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == payload.email).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        user = User(
            email=payload.email,
            password_hash=hash_password(payload.password),
            role=payload.role,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        access = create_access_token(subject=str(user.id), role=user.role)
        refresh = create_refresh_token(subject=str(user.id), role=user.role)
        return TokenPair(access_token=access, refresh_token=refresh)
    finally:
        db.close()


@router.post("/login", response_model=TokenPair)
def login(payload: LoginBody):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == payload.email).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        if not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        access = create_access_token(subject=str(user.id), role=user.role)
        refresh = create_refresh_token(subject=str(user.id), role=user.role)
        return TokenPair(access_token=access, refresh_token=refresh)
    finally:
        db.close()


@router.post("/refresh", response_model=TokenPair)
def refresh(body: RefreshBody):
    # Keep refresh simple for now: decode token and issue a new access.
    from app.core.auth import decode_token

    payload = decode_token(body.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user_id = payload.get("sub")
    role = payload.get("role")
    if not user_id or not role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    access = create_access_token(subject=str(user_id), role=str(role))
    refresh = create_refresh_token(subject=str(user_id), role=str(role))
    return TokenPair(access_token=access, refresh_token=refresh)

