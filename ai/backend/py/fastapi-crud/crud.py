from models import User
from sqlalchemy.orm import Session
from sqlalchemy import select
from models import Post
from schemas import PostCreate, PostResponse,UserCreate, UserUpdate,PostUpdate
import bcrypt #密码加密
def get_user_by_email(db:Session,email:str) -> User|None:
    #orm操作映射为sql语句
    stmt = select(User).where(User.email == email)
    return db.scalars(stmt).first()

def create_user(db:Session,user_in:UserCreate)->User:
    """创建用户"""
    hashed = bcrypt.hashpw(
        user_in.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    db_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed
    )
    db.add(db_user) #insert
    db.commit() #commit
    db.refresh(db_user) #refresh
    return db_user

def get_users(db:Session,skip:int=0,limit:int=100)->list[User]:
    """获取用户列表"""
    stmt = select(User).offset(skip).limit(limit)
    return db.scalars(stmt).all()

def get_user(db:Session,user_id:int)->User|None:
    """获取用户详情"""
    stmt = select(User).where(User.id == user_id)
    return db.scalars(stmt).first()

def update_user(db:Session,user:User,user_in:UserUpdate)->User:
    """更新用户"""
    if user_in.username:
        user.username = user_in.username
    if user_in.email:
        user.email = user_in.email
    if user_in.password:
        user.hashed_password = bcrypt.hashpw(
            user_in.password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")
    if user_in.is_active is not None:
        user.is_active = user_in.is_active
    db.commit()
    db.refresh(user)
    return user

def create_post(db: Session, post_in: PostCreate, user_id: int) -> Post:
    """为指定用户创建文章"""
    db_post = Post(
        title=post_in.title,
        content=post_in.content,
        published=post_in.published,
        user_id=user_id,
    )
    db.add(db_post) # orm sql处理 变成了对象上的方法，简化了sql编写，一直oop思想
    db.commit()
    db.refresh(db_post)
    return db_post

def delete_user(db: Session, user: User) -> None:
    """删除用户；其文章按 User.posts 的 cascade 一并删除"""
    #orm封装，sql不具备
    user = crud.get_user(db, user.id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在",
        )
    db.delete(user)
    db.commit()

def get_posts(db:Session,skip:int=0,limit:int=100)->list[Post]:
    """获取文章列表"""
    stmt = select(Post).offset(skip).limit(limit)
    return list(db.scalars(stmt).all())

def get_post(db:Session,post_id:int)->Post|None:
    """按id获取文章"""
    return db.get(Post,post_id)

def get_user_posts(db:Session,user_id:int)->list[Post]:
    """获取指定用户的所有文章"""
    stmt = select(Post).where(Post.user_id == user_id)
    return list(db.scalars(stmt).all())
    
def update_post(db:Session,post:Post,post_in:PostUpdate)->Post:
    """更新文章"""
    update_data = post_in.model_dump(exclude_unset=True)
    for field,value in update_data.items():
        setattr(post,field,value)
    db.commit()
    db.refresh(post)
    return post

def delete_post(db:Session,post:Post)->None:
    """删除文章"""
    db.delete(post)
    db.commit()