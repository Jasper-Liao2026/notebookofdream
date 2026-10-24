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
    is_active:bool|None = None

class UserResponse(BaseModel):
    #user类，查询users orm 数据模型
    #configDict从orm模型中获取字段
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime

## 文章模块 schema
class PostCreate(BaseModel):
    title:str = Field(min_length=3, max_length=200)
    content:str = Field(min_length=1,max_length=5000)
    published:bool = False

class PostUpdate(BaseModel):
    """更新请求体：字段可选，未传表示不修改"""
    title: str | None = Field(default=None, min_length=3, max_length=200)
    content: str | None = Field(default=None, min_length=1, max_length=5000)
    published: bool | None = None

class PostResponse(BaseModel):
    """返回的文章数据"""
    #Post实例 -> ConfigDict 转化为dict类型
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    content: str
    published: bool
    created_at: datetime
    updated_at: datetime
    user_id: int

class PostWithAuthor(PostResponse):
    """列表场景：附带作者信息"""
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    content: str
    published: bool
    created_at: datetime
    author: UserResponse

class PostUpdate(BaseModel):
    """更新请求体：字段可选，未传表示不修改"""
    title: str | None = Field(default=None, min_length=3, max_length=200)
    content: str | None = Field(default=None, min_length=1, max_length=5000)
    published: bool | None = None