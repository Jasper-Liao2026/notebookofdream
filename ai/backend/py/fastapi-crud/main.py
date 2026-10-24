from fastapi import FastAPI
from database import engine,Base
from routers import users, posts
import models  # 必须先导入模型类，Base.metadata 才会登记 users / posts
#python 实例化不用new
#自动将__init__方法调用
#便捷

#建表 orm自动根据模型类创建表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Blog API",
    description="FastAPI + SQLAlchemy 博客系统",
    version="1.0.0"

)
#装饰器模式
@app.get("/")
def root():
    return {"message":"Blog API","docs":"/docs"}

#模块路由
app.include_router(users.router)
#文章模块路由
app.include_router(posts.router)