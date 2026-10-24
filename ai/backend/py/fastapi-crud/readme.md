# fastapi 博客系统

# 后端 api 开发

- python 生态 ， ai->web backend fastapi 有市场
快速的用于api服务的web转化(简单)
nestjs 企业级开发服务(复杂)

### 后端 api 构成
- http 服务
  nestjs3000 fastapi 8000
- 数据库
  sqlite 关系型数据库（轻量级）
  .db 文件可以随着程序发布，不像mysql、psql 需要独立部署
  - orm 对象关系映射
  SQLAlchemy
- 路由模块
   restful api

### 目录文件的意义
- main.py 单点入口+路由注册
- database.py 引擎(驱动)、会话、base、get_db
ORM 工具
- models.py 定义数据库模型 
- schemas.py  约束 新建用户
- crud.py service

- api 文档
fastapi 自动生成文档

## 启动http server
uvicorn main:app --reload
uvicorn ASGI(Asynchronous Server Gateway Interface) 服务器 ，负责把你的fastapi 应用跑起来

## ORM 的开发流程
- 创建的模型类 models.py
- 根据restful 定义路由