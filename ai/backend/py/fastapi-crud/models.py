from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base
#用户表
class User(Base):
    __tablename__ = "users"  # 表名，对应 DDL：CREATE TABLE users
    # 约束声明规则：左侧 Mapped[T] 不写 | None 就映射为 NOT NULL；右侧 mapped_column 的参数才落到 DDL
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)  # PRIMARY KEY (id)；SQLite 的 INTEGER PRIMARY KEY 本身自增
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)  # VARCHAR(50) NOT NULL + 唯一索引
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)  # VARCHAR(100) NOT NULL + 唯一索引
    hashed_password: Mapped[str] = mapped_column(String(200))  # VARCHAR(200) NOT NULL，不建索引
    is_active: Mapped[bool] = mapped_column(default=True)  # default 是 Python 层默认值：DDL 里没有 DEFAULT，由 ORM 在 INSERT 时补
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()  # server_default 是数据库层默认值：DDL 出现 DEFAULT CURRENT_TIMESTAMP
    )
    posts: Mapped[list["Post"]] = relationship(
        back_populates="author", cascade="all, delete-orphan"  # 不是列、不生成 SQL；级联删除只在 ORM 层生效
    )
#文章表
class Post(Base):
    __tablename__ = "posts"  # 表名，对应 DDL：CREATE TABLE posts
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)  # PRIMARY KEY (id)，自增
    title: Mapped[str] = mapped_column(String(200))  # VARCHAR(200) NOT NULL
    content: Mapped[str] = mapped_column(String(5000))  # VARCHAR(5000) NOT NULL
    published: Mapped[bool] = mapped_column(default=False)  # Python 层默认 False，DDL 无 DEFAULT
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()  # 数据库层默认值：DEFAULT CURRENT_TIMESTAMP
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()  # onupdate 是 ORM 层：每次 UPDATE 时改写该列，DDL 里没有 ON UPDATE
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)  # 外键约束 REFERENCES users(id) + 普通索引
    author: Mapped["User"] = relationship(back_populates="posts")  # 只是 ORM 导航属性，不生成列