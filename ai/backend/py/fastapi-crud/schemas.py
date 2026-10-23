# crud 请求体 ，查询参数，路由params 是否符合schema约束
# 输出
from datetime import datetime
#zod
# BaseModel schema 基础类 ，自动获得校验能力
# EmailStr 邮件格式
# Field 字段注释
from pydantic import BaseModel, EmailStr, Field, ConfigDict
#检验用户创建请求体
class UserCreate(BaseModel):
    #example swagger api 文档
    username: str = Field(min_length=3, max_length=50, examples=["zhangsan"])
    email: EmailStr = Field(examples=["zhang@example.com"])
    password: str = Field(min_length=8, max_length=100)

# 更新请求体：各字段可选（局部更新，PATCH/PUT 都适用）
# 未传的字段为 None，表示“不修改”
class UserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=3, max_length=50)
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=8, max_length=100)

class UserResponse(BaseModel):
    #user类，查询users orm 数据模型
    #configDict从orm模型中获取字段
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime
    