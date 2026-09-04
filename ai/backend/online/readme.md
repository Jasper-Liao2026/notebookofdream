# 全栈项目部署全流程
- 运维工程师
加分项
- vercel 云端部署
    - 比较固定
nextjs + supabase 项目
java，go，python 部署自由度
- 国内支持
腾讯云 

## 使命
- 理解部署的全流程
- nginx+node 用宝塔面板搭建生产环境
- 前后端分离的项目
   - react + ts 产出？
   组件，
   npm run dev
   npm run bulid dist/静态资源文件
   - node
   /api 接口 json 

## 部署全流程
- 得花钱买服务器
- 买域名？备案 10-20天
- 配置HTTPS 更安全的http SSL
- nginx
- 反向代理
  前后端、api通信？
  跨域
  不存在
  ：5173 /api/todos mocks 拦截/api todos
  前端发送请求，vite 基础设施 拦截？
  ：5173 /api/todos nginx？拦截前端的请求 反向代理 server 3001
- 安全 

## 购买服务器
轻量云服务器，linux
全量的linux部署，命令行成本有点高，难度
宝塔(BT panel)
可视化的，点击操作，完成服务器的部署
给服务器装了一个“控制台/操作系统的后台”
得到了一个公网IP

## 宝塔的优势
/www/wwwroot
服务器内置了宝塔 ：8888
- 可视化
- 自由度高
    想怎么部署就怎么部署

## 用户访问网站到底发生了什么？
1. Browser -> DNS(Domain Name System) 先找到服务器
DNS 返回 服务器公网IP
先查地址，再去敲门
DNS 查询会缓存在本地
- browser
- 上网设备
- 局域网
- 城域网
- 根服务器 .com .cn
2. 安全组 防火墙
看门人
- ip限流，恶意ip，
- 尽量的少开端口

安全组 防火墙
80 http 默认端口
443 https 默认端口
3306 Mysql 可选择的访问
只开放给一些ip dev，production

安全组
    位置：云厂商网络层（比如腾讯云）
    作用？控制这台云服务器哪些端口被外网访问
    类比：小区保安，不让进
防火墙：
    位置：服务器操作系统内部

3. nginx 真正的入口
- 静态资源
react + ts 打包的
route， static route，返回静态资源
- 动态资源
route 走服务器路由
Nginx 是一个高性能的web服务器
三件事：接受请求，返回静态文件，或把请求转发给后端（反向代理解决跨域问题）

nginx 配置/api -> 反向代理
json -> nginx 返回前端调用

## 服务器准备
- 网站-> node项目
Node.js 版本管理器 nvm 同时容纳多个版本，指针，当前是哪个版本
node 版本需求不一样，项目依赖不同的node 版本
- html 装 nginx 
- 安装MySQL
    - 建立 dev/production 两个库
    - 开发和线上互相不影响
time_capsule_dev
TJKAZaYb8NHc2K5B
time_capsule_production
Rym6sYBy8X2bPNpF

## 项目在本地跑起来
### 前端
- 瀑布流(小红书)，无限滚动