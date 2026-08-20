# Docker
容器 
Docker 是一个应用容器化工具，解决我的电脑能跑，你的电脑怎么跑的问题
依赖
- node
- redis
- next
- react
- mysql ...
除了代码，依托一堆的，有版本要求的运行环境，docker帮我们打包为一个整体的容器，非常方便的部署在任何设备上

Agent = LLM + Harness(tool+mcp+rag+skill...+...)
Docker = 应用 + 运行环境

## 举例
你到公司接手一个n年前的项目，要求使用node16，
你的电脑装的是node22， 跑不起来的
容器化 docker 虚拟化技术，将各个依赖隔离化安装

## Docker 基本概念
image 光盘
应用程序 + 环境 隔离的
git pull image
container DVD 

## Web 简单应用
http://localhost:1314

:80 默认端口号
运维知识
服务器软件 把所有80 端口产生的请求，代理给3000端口

## nginx服务器
高并发、代理转发、需要nginx
监听80 端口的访问
并通过配置文件帮我们转发1314端口

### 启动 nginx image
docker run 
    启动一个镜像，成为可以运行的容器
    --name my-nginx-demo
    容器的名字
    -p 80:80
    本机的80端口：容器的80
    80是nginx 的监视端口
    http://localhost:80 用户的浏览器输入转给，映射给container 80
    -v C:\Users\liaoh\Desktop\学习\ai\backend\docker\demo\nginx.conf:/usr\etc\nginx\nginx.conf

    nginx.conf配置文件(本机)
    80 代理1314端口

    -d nginx
    后台运行nginx
    docker run --name my-nginx-demo -p 80:80 -v C:\Users\liaoh\Desktop\学习\ai\backend\docker\demo\nginx.conf:/usr\etc\nginx\nginx.conf -d nginx

## 运维考点
- nginx
    反向代理

    用户上网intent -> browser(正向代理) 

    local:80 ->docker -p(ort):container(80) -> -v映射
    配置文件(local:/etc/nginx/nginx.conf) -> -d 后台运行

    nginx:80(nginx.conf 代理端口服务) <- :1314(反向代理)
    localhost 我们是不知道后端具体在哪个端口上运行的

- docker 
  pull 任何想要的镜像 
  run 任何的镜像
  