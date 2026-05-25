# Users Chat AI 全栈项目

- 后端+前端目录创建
    目录 -> 全栈项目 -> 协作形式 (前后端分离 古法编程) -> 模块化

## 模块化 module
- 一个函数只做一个功能
- 一个文件只写一个类/模块
- 一个文件夹只负责一个模块/架构
### 优势
- 好维护
- 高质量
- 可读性、简单可靠

## js
前端，后端，ai，嵌入式.....

## users 项目需求
- 后端 
    user 相关的数据接口 api(Application Interface)
    http server
    -url universal resource location 统一资源定位符
    http://localhost:3000/users 用户列表资源
    http://localhost:3000/users/:id 动态路由 某个用户的详情

### restful 设计模式 暴露资源
web开发根基   阿里巴巴java代码规范
- 设计 url 的范式
协议://域名:端口  某台服务器的某个服务 资源
http://localhost:3000/users 
http://localhost:3000/books
http://localhost:3000/posts
http://localhost:3000/posts/:id  某篇文章

- htpp的动作
    CRUD 增删查改
    GET  read http://localhost:3000/posts/:id
    POST create http://localhost:3000/posts 
    PUT/PATCH Update 
    DELETE Delete

- js node 后端初始化 
    npm init -y
    package.json 项目描述文件
    npm (node package management) node包管理器
    npm i json-server 

## 数据存储
- 数组、对象 内存中的数据容器
- 长期存储
    数据库 mysql 
    json文件 javascript object notation{key:val...}
    excal csv 文本 pdf...

## 前端
- 前端三剑客 模块化


## prompt 
- 加上模块化的约束
- 请你帮我设计users 用户数据接口，请遵守restful机制 


