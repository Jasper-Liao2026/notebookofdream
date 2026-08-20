# Docker 基本概念

> 从一个 Node.js + Nginx 反向代理的实战场景出发，理解 Docker 的核心概念。

---

## 1. 引言：从你的 Demo 场景说起

假设你在 Windows 上开发了一个 **Node.js 服务**（`index.js`），监听 1314 端口，返回 "hello world"。你还写了一个 **Nginx 反向代理**（`nginx.conf`），打算把 80 端口的请求转发到 1314 端口。

问题来了：**怎么让 Nginx 跑起来，而且是独立、可移植、不污染本机环境的方式？**

这就是 Docker 要解决的问题。你执行的那条命令，其实就是 Docker 世界里最核心的操作：

```bash
docker run --name my-nginx-demo -p 80:80 -v C:\...\nginx.conf:/etc/nginx/nginx.conf -d nginx
```

下面我们以这条命令为线索，逐一拆解 Docker 的基本概念。

---

## 2. Docker 是什么

Docker 是一个 **容器化平台**，它把应用及其所有依赖打包成一个标准化的单元，在任何安装了 Docker 的机器上都能一致地运行。

> **Docker ≈ 轻量级虚拟机**，但它共享宿主机操作系统内核，启动速度秒级，资源占用极低。一个容器只跑一个进程，而不是一个完整的操作系统。

Docker 的核心价值在于三个词：**打包、分发、运行**。你把应用打包成镜像，分发到任何机器上，用同样的命令运行，结果完全一致。

### Docker 整体架构

Docker 采用 **Client-Server 架构**：

```
┌──────────┐     REST API      ┌────────────┐      ┌──────────────┐
│  docker   │ ───────────────→ │  dockerd    │ ←──→ │  containerd  │
│  (CLI)    │                  │  (守护进程)  │      │  (容器运行时)  │
└──────────┘                   └────────────┘      └──────────────┘
                                     │
                                     │ pull/push
                                     ▼
                              ┌──────────────┐
                              │  Registry     │
                              │  (Docker Hub) │
                              └──────────────┘
```

- **docker CLI** — 你敲命令的地方，比如 `docker run`
- **dockerd（守护进程）** — 后台服务，负责管理镜像、容器、网络、存储
- **containerd** — 真正创建和运行容器的底层运行时
- **Registry** — 镜像仓库，Docker Hub 是默认的公共仓库，也可以搭建私有仓库

> **注意：** 在 Windows 上，Docker 实际上是跑在一个轻量 Linux 虚拟机里的（WSL 2 或 Hyper-V），所以 `docker` 命令虽然看起来在 Windows 上执行，但守护进程在 Linux 里。

### Docker vs 虚拟机

| 维度 | Docker 容器 | 虚拟机 |
|------|------------|--------|
| 启动速度 | 秒级 | 分钟级 |
| 资源占用 | MB 级别，共享宿主机内核 | GB 级别，每个 VM 有独立 OS |
| 隔离性 | 进程级隔离，共享内核 | 完全隔离，独立内核 |
| 镜像大小 | 通常几十到几百 MB | 通常几 GB |
| 可移植性 | 任意 Linux 宿主机 | 受 Hypervisor 限制 |
| 适用场景 | 微服务、CI/CD、开发环境 | 多租户强隔离、跑不同 OS |

> **一句话区分：** 虚拟机虚拟硬件，容器虚拟操作系统。想在同一台机器上同时跑 Linux 和 Windows？用虚拟机。想把一个 Node 服务打包成随处可跑的单元？用容器。

---

## 3. 镜像（Image）

**镜像** 是容器的"模板"或"快照"，包含了运行应用所需的一切：代码、运行时、系统库、环境变量、配置文件。镜像 **只读**，不可修改。

在你的命令中，`nginx` 就是一个镜像名：

```bash
docker run ... nginx
```

Docker 会先从本地查找是否有 `nginx:latest` 镜像，如果没有，就去 Docker Hub 拉取。你之前执行 `docker images` 看到的输出就是本机已有的镜像列表：

| IMAGE | ID | DISK USAGE | 含义 |
|-------|-----|-----------|------|
| `nginx:latest` | 8541484afbc9 | 241MB | 完整版 Nginx，基于 Debian |
| `nginx:alpine` | 4a73073bd557 | 93.6MB | 精简版 Nginx，基于 Alpine Linux |
| `hello-world:latest` | 5dd0d3e6e255 | 25.9kB | Docker 官方测试镜像，仅 9.49kB 内容 |

> **小贴士：** 生产环境推荐用 `nginx:alpine`，体积只有完整版的 1/3，攻击面更小。你的 demo 用了 `nginx:latest`（241MB），换成 alpine 能省 150MB。

### 镜像标签（Tag）与版本管理

镜像名后面的 `:latest`、`:alpine` 就是 **标签（tag）**，用于区分同一个镜像的不同版本或变体。如果你不写标签，Docker 默认拉取 `:latest`。

```bash
docker pull nginx                # 等价于 nginx:latest
docker pull nginx:alpine         # 指定 alpine 版本
docker pull nginx:1.25.3         # 指定具体版本号
docker pull node:18-alpine       # Node 18 的 alpine 版本
```

> **生产环境务必指定精确版本号**（如 `nginx:1.25.3`），不要依赖 `latest`。`latest` 标签会随着新版本发布而改变，可能导致你的应用突然行为不一致。

### 镜像的分层结构

镜像不是一个大文件，而是 **多层叠加** 的。每一层代表一次文件系统变更（比如安装一个包、复制一个文件）。这种设计的好处是：

- **复用**：多个镜像可以共享相同的基础层，节省磁盘空间
- **增量构建**：修改 Dockerfile 后只需重建变化的层
- **快速分发**：拉取镜像时只需下载缺失的层

---

## 4. 容器（Container）

**容器** 是镜像的运行实例。你可以把镜像理解成"类"（Class），容器就是"对象"（Instance）。一个镜像可以启动多个容器，每个容器之间相互隔离。

你的命令中：

```bash
docker run --name my-nginx-demo ... nginx
```

`--name my-nginx-demo` 给容器起了一个名字，方便后续管理：

| 命令 | 作用 |
|------|------|
| `docker ps` | 查看正在运行的容器 |
| `docker ps -a` | 查看所有容器（包括已停止的） |
| `docker stop my-nginx-demo` | 停止容器 |
| `docker start my-nginx-demo` | 启动已停止的容器 |
| `docker rm my-nginx-demo` | 删除容器 |
| `docker rm -f my-nginx-demo` | 强制删除（不管是否在运行） |
| `docker logs my-nginx-demo` | 查看容器日志 |
| `docker exec -it my-nginx-demo sh` | 进入容器内部执行命令 |

> **注意：** 容器是无状态的 — 删除容器后，容器内的所有数据都会丢失。如果数据需要持久化，要用**挂载卷**（见第 7 节）。

---

## 5. docker run 命令完整拆解

回到你的那条命令，我们逐段分析：

```bash
docker run --name my-nginx-demo -p 80:80 -v C:\...\nginx.conf:/etc/nginx/nginx.conf -d nginx
```

| 参数 | 含义 |
|------|------|
| `docker run` | 创建并启动一个新容器 |
| `--name my-nginx-demo` | 给容器命名为 `my-nginx-demo` |
| `-p 80:80` | 端口映射：宿主机 80 → 容器 80 |
| `-v C:\...\nginx.conf:/etc/nginx/nginx.conf` | 挂载卷：把本地配置文件注入容器 |
| `-d` | 后台运行（detached mode） |
| `nginx` | 使用的镜像名 |

下面重点展开最关键的参数：`-p`、`-v` 和 `-e`。

### 补充：环境变量（-e）

容器经常需要配置环境变量来传递运行时参数，比如数据库连接地址、API 密钥等：

```bash
# 单个环境变量
docker run -e NODE_ENV=production nginx

# 多个环境变量
docker run -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=myapp mysql:8

# 从文件加载环境变量（推荐，避免密码留在 shell 历史中）
docker run --env-file .env my-app
```

| 参数 | 含义 |
|------|------|
| `-e KEY=VALUE` | 设置单个环境变量 |
| `--env-file .env` | 从文件加载所有环境变量 |

> **安全提醒：** 不要在 `docker run` 命令中直接写密码等敏感信息，它们会留在 shell 历史记录里。用 `--env-file` 从 `.env` 文件加载，并确保 `.env` 加入了 `.gitignore`。

---

## 6. 端口映射（-p）

**容器有自己独立的网络栈**。容器内 Nginx 监听 80 端口，但那是容器内部的 80 端口，宿主机默认访问不到。需要通过 `-p` 把容器端口"暴露"到宿主机。

```
-p 宿主机端口:容器端口
-p 80:80    ← 访问 localhost:80 就等于访问容器内的 80 端口
```

这就是为什么你访问 `http://localhost` 能看到 Nginx 页面 — 宿主机 80 端口的流量被 Docker 转发到了容器内的 80 端口。

端口映射的常见格式：

| 写法 | 含义 |
|------|------|
| `-p 8080:80` | 宿主机 8080 → 容器 80 |
| `-p 80:80` | 宿主机 80 → 容器 80（端口号可以相同） |
| `-p 127.0.0.1:80:80` | 只绑定本机回环地址，外部无法访问 |
| `-p 80:80/udp` | 指定 UDP 协议（默认 TCP） |

---

## 7. 挂载卷（-v / --volume）

**挂载卷** 让你把宿主机上的文件或目录"映射"到容器内部。容器内的修改会同步到宿主机，反之亦然。

```
-v 宿主机路径:容器路径
-v C:\...\nginx.conf:/etc/nginx/nginx.conf
```

在你的场景中，这条挂载的作用是：

> **用你本地的 `nginx.conf` 替换容器内 Nginx 自带的默认配置。** 这样你修改本地文件，重建容器后就能生效，不需要进入容器内部编辑。

你之前踩过的坑也在这里：

- **路径必须正确：** 容器内 Nginx 默认配置路径是 `/etc/nginx/nginx.conf`，不是 `/usr/etc/...`。写错路径的话，挂载到了错误位置，Nginx 还是用的默认配置，所以你看到了 Welcome 页面。
- **Windows 路径：** Windows 下的绝对路径在 PowerShell 中要用反斜杠或正斜杠，Docker 需要正斜杠：`C:/Users/liaoh/Desktop/...`

挂载卷的常见用法：

| 用法 | 场景 |
|------|------|
| 挂载配置文件 | 像你的 demo，注入 `nginx.conf` |
| 挂载代码目录 | 开发时实时同步代码，修改即生效 |
| 挂载数据目录 | 数据库的数据文件持久化到宿主机，删容器不丢数据 |

### 数据卷的三种类型

Docker 提供了三种持久化方式，你用的 `-v` 属于第一种：

| 类型 | 写法 | 存放位置 | 适用场景 |
|------|------|----------|----------|
| **Bind Mount** | `-v /host/path:/container/path` | 宿主机任意路径 | 开发环境、注入配置文件 |
| **Volume** | `-v volume_name:/container/path` | Docker 管理的 `/var/lib/docker/volumes/` | 生产环境、数据库持久化 |
| **tmpfs** | `--tmpfs /container/path` | 宿主机内存 | 临时敏感数据、缓存 |

**Bind Mount**（你用的这种）：
```bash
-v C:\...\nginx.conf:/etc/nginx/nginx.conf
```
优点：直接访问宿主机文件，方便开发调试。缺点：路径依赖宿主机，换机器可能不兼容。

**Volume**（Docker 管理）：
```bash
docker volume create my-data
docker run -v my-data:/var/lib/mysql mysql:8
```
优点：由 Docker 统一管理，跨平台一致，备份恢复方便。缺点：不能直接像普通文件一样浏览。

> **生产环境推荐用 Volume**，开发环境用 Bind Mount。

---

## 8. 容器网络：host.docker.internal

你的 `nginx.conf` 中有这样一行：

```nginx
proxy_pass http://host.docker.internal:1314;
```

这涉及 Docker 网络中的一个关键问题：**容器内写 `localhost`，指的是容器自己，不是宿主机。**

在你的架构中：

- **Nginx** 跑在 Docker 容器里
- **Node.js 服务** 跑在宿主机（Windows）上，监听 1314 端口

如果 `proxy_pass` 写成 `http://localhost:1314`，容器会去找自己内部的 1314 端口，但容器里根本没有 Node 服务，请求就会失败。

> **解决方案：** Docker Desktop（Windows / macOS）提供了一个特殊域名 `host.docker.internal`，容器通过它可以直接访问宿主机。Linux 下没有这个内置域名，需要用 `--add-host` 手动添加，或者用 `172.17.0.1`（默认网桥网关）。

Docker 默认提供三种网络模式：

| 网络模式 | 特点 | 适用场景 |
|----------|------|----------|
| `bridge`（默认） | 容器有独立 IP，通过宿主机 NAT 访问外网 | 大多数场景 |
| `host` | 容器直接使用宿主机网络栈，没有隔离 | 高性能需求，Windows/Mac 不支持 |
| `none` | 容器没有网络 | 纯计算任务 |

---

## 9. Dockerfile：构建自己的镜像

到目前为止，你用的都是现成的 `nginx` 镜像。但你的 Node.js 服务呢？可以用 **Dockerfile** 把自己的应用也打包成镜像，跟 Nginx 放在同一个 Docker 网络里，就不需要 `host.docker.internal` 了。

一个给你的 `index.js` 写的 Dockerfile：

```dockerfile
# 基于 Node.js 官方镜像
FROM node:18-alpine

# 设置容器内工作目录
WORKDIR /app

# 复制 package.json 并安装依赖
COPY package.json .
RUN npm install

# 复制源代码
COPY index.js .

# 暴露端口（文档作用，实际映射仍需 -p）
EXPOSE 1314

# 启动命令
CMD ["node", "index.js"]
```

核心指令解释：

| 指令 | 作用 |
|------|------|
| `FROM` | 指定基础镜像，每条 Dockerfile 必须以 FROM 开头 |
| `WORKDIR` | 设置工作目录，后续指令都在这个目录下执行 |
| `COPY` | 把宿主机文件复制到镜像 |
| `RUN` | 在构建镜像时执行命令（如安装依赖） |
| `EXPOSE` | 声明容器监听的端口（文档性质，实际映射仍需 -p） |
| `CMD` | 容器启动时执行的默认命令 |

### CMD vs ENTRYPOINT

这是 Dockerfile 中最容易混淆的两个指令：

| 指令 | 行为 | 可被 `docker run` 覆盖？ |
|------|------|--------------------------|
| `CMD` | 定义默认命令和参数 | 可以完全覆盖 |
| `ENTRYPOINT` | 定义容器的主进程入口 | 不会被覆盖，参数追加到后面 |

```dockerfile
# CMD 模式：docker run my-app echo hello → 输出 hello
CMD ["node", "index.js"]

# ENTRYPOINT 模式：docker run my-app index2.js → 等价于 node index2.js
ENTRYPOINT ["node"]
CMD ["index.js"]
```

> `ENTRYPOINT` + `CMD` 组合是最佳实践：`ENTRYPOINT` 固定主程序，`CMD` 提供默认参数，运行时可以灵活替换参数。

构建和运行：

```bash
# 构建镜像
docker build -t my-node-app .

# 运行容器
docker run --name my-node-demo -p 1314:1314 -d my-node-app
```

### .dockerignore

和 `.gitignore` 类似，`.dockerignore` 告诉 Docker 构建时忽略哪些文件，避免把 `node_modules`、日志、`.env` 等无关文件打进镜像：

```
# .dockerignore
node_modules
.git
.env
*.log
dist
```

> 没有 `.dockerignore` 的话，`COPY . .` 会把整个项目目录复制进镜像，包括 `node_modules`（可能和容器内系统不兼容）和敏感文件，导致镜像体积暴增甚至构建失败。

### 多阶段构建（Multi-stage Build）

上面的 Dockerfile 有个问题：`node_modules` 里包含了构建工具和开发依赖，它们在生产环境不需要，却白白占了几百 MB。**多阶段构建** 可以解决这个问题：

```dockerfile
# ===== 阶段 1：构建 =====
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install --production   # 只装生产依赖
COPY index.js .

# ===== 阶段 2：运行 =====
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .     # 只从构建阶段复制产物
EXPOSE 1314
CMD ["node", "index.js"]
```

这样最终镜像里只有运行时代码和生产依赖，体积比单阶段构建小很多。大型项目（如 Go、Java、前端）中多阶段构建几乎是标配。

### 进阶：Docker Compose

当你有多个容器需要协同工作时（比如 Nginx + Node），用 `docker run` 一个个启动很麻烦。可以用 **Docker Compose** 一次性编排所有服务：

```yaml
# docker-compose.yml
version: "3.8"
services:
  node:
    build: .
    ports:
      - "1314:1314"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - node
```

然后一行命令启动全部：

```bash
docker compose up -d
```

注意现在 `proxy_pass` 就可以直接用服务名 `node:1314` 了，因为 Compose 会自动创建内部网络，容器之间通过服务名互相访问。

---

## 10. 常用命令速查

| 命令 | 作用 |
|------|------|
| `docker images` | 列出本地镜像 |
| `docker pull nginx:alpine` | 拉取镜像 |
| `docker build -t name .` | 构建镜像 |
| `docker rmi nginx:latest` | 删除镜像 |
| `docker ps` | 查看运行中的容器 |
| `docker ps -a` | 查看所有容器 |
| `docker run ...` | 创建并启动容器 |
| `docker stop my-nginx-demo` | 停止容器 |
| `docker start my-nginx-demo` | 启动已有容器 |
| `docker restart my-nginx-demo` | 重启容器 |
| `docker rm -f my-nginx-demo` | 强制删除容器 |
| `docker logs my-nginx-demo` | 查看日志 |
| `docker exec -it my-nginx-demo sh` | 进入容器 |
| `docker compose up -d` | Compose 启动所有服务 |
| `docker compose down` | Compose 停止并删除所有服务 |

---

## 11. 总结

回顾你整个 Demo 的学习路径，你已经接触了 Docker 最核心的概念：

1. **镜像** — `nginx:latest`，应用的模板，分层存储，通过标签管理版本
2. **容器** — `my-nginx-demo`，镜像的运行实例，无状态，删即毁
3. **端口映射** — `-p 80:80`，打通宿主机和容器的网络
4. **挂载卷** — `-v nginx.conf:/etc/nginx/nginx.conf`，注入配置文件，区分 Bind Mount / Volume / tmpfs
5. **环境变量** — `-e` / `--env-file`，向容器传递运行时配置
6. **容器网络** — `host.docker.internal`，容器访问宿主机；bridge / host / none 三种模式
7. **Dockerfile** — 把自己的应用也打包成镜像，CMD vs ENTRYPOINT
8. **.dockerignore** — 排除无关文件，减小镜像体积
9. **多阶段构建** — 分离构建环境和运行环境，进一步精简镜像
10. **Docker Compose** — 编排多个容器协同工作，一行命令启动全部服务

> **一句话总结：** Docker 让你把应用和环境一起打包，在任何机器上都能一致运行。你写的 Node 服务 + Nginx 反向代理，用 Docker 就是两条命令的事，而且换一台电脑结果完全一样。

---

*本文基于 `docker\demo` 目录下的实战项目撰写，所有代码示例均来自实际开发和调试过程。*