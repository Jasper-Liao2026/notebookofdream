# FastAPI  + Vue3 + Langchain 实战

## FastAPI
是python 高性能的web接口框架，上手简单快速，性能比肩go/node
自动生成交互式接口文档(前后端api 约定，swagger,自动生成)
写少量代码，自带类型提示
专门用于后端api，写接口不用折腾繁琐配置，开发效率很高，特别适合结合langchain/langgraph

对异步(node) 异步无阻塞  高并发

FastAPI = Pydantic(zod类型检测 用户输入，params，类) + Starlette(负责web底层，接收http服务，路由匹配，返回响应，处理网络，自带异步能力，是高性能的web基座)

/user/123 pydantic 约束一定是整数

Starlette 异步
async
    - 数据库查询
    - 文件读写

## 环境安装
日常开发的全套工具
pip install "fastapi[standard]" 
uvicorn 是异步的web服务器，用来运行Fastapi项目
pip install "uvicorn[standard]"
python -m uvicorn 01.main:app --reload --port 8080
