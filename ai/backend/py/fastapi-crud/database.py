# 向外输出egine，Base import export default
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session

DATABASE_URL = "sqlite:///./blog.db" # 轻量文本关系型数据库
#创建数据库引擎
# echo=True 打印sql语句
#用于测试，上线时关闭echo
#python没有export default语法 顶层变量自动导出
engine = create_engine(DATABASE_URL, echo=True)
#事物概念 transaction 要不都成功，要不回滚
#手动控制刷新，用于新增后得到新的数据，为了性能和安全
#autocommit 自动提交事务
SessionLocal = sessionmaker(bind=engine,  autoflush=False, autocommit=False)
# 继承 DeclarativeBase类，就能变成 ORM 实体
class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        #yield把会话交给FastAPI 路由使用，函数在这里暂停
        yield db
    finally:
        #请求处理完成 ，不管成功还是报错，都会关闭释放链接
        db.close()