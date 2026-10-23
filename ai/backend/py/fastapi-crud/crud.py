# service 层：只做数据库操作，不关心 HTTP
import hashlib
import secrets

from sqlalchemy import select
from sqlalchemy.orm import Session

from models import User
from schemas import UserCreate, UserUpdate


def hash_password(password: str) -> str:
    """用 PBKDF2 + 随机盐做哈希，格式：salt$hash"""
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 260000)
    return f"{salt}${digest.hex()}"


def get_user(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.scalar(select(User).where(User.username == username))


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def list_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    return list(db.scalars(select(User).order_by(User.id).offset(skip).limit(limit)))


def create_user(db: Session, data: UserCreate) -> User:
    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user: User, data: UserUpdate) -> User:
    # exclude_unset：只取客户端真正传了的字段，没传的保持原值
    changes = data.model_dump(exclude_unset=True)
    if "password" in changes:
        user.hashed_password = hash_password(changes.pop("password"))
    for field, value in changes.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: User) -> None:
    db.delete(user)
    db.commit()
