# 依赖注入
from fastapi import APIRouter, Depends, HTTPException, status
from schemas import UserCreate, UserResponse, UserUpdate
from database import get_db
from sqlalchemy.orm import Session
from models import User
import crud

# fastapi 自带 api 文档 swagger
router = APIRouter(prefix="/users", tags=["用户管理"])
# 路由装饰器 + restful 资源 
# 约定
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    return {"message":"Blog API","docs":"/docs"}
