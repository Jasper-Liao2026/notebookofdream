# Next.js Blog
- npx
npx 是npm自带的工具，可直接运行node包，无需全局安装依赖
尝试试用，测试电脑跑项目
npx = npm i -g create-next-app + create-next-app
便捷
- create-next-app
React 全栈开发脚手架
SSR(服务端渲染) SEO RSC (React Server Component)
use client; hydration 水和

## 项目需求
笔记系统，crud笔记，支持markdown格式
存在数据库里的是markdown，页面显示的是html marked
1. 界面分为两列 左侧为笔记列表，右侧是笔记内容
/ page.js
2. 点击new 增加一个Note，增加后，左侧笔记列表也会同时更新
App Router 文件即路由 rustful
/add POST 
/note [id] 动态路由
    page.js note 详情
/edit
    [id]
    page.js修改
    page 新增一条
3. 编辑功能，可以删除一个笔记，左侧同时更新
4. 可以编辑当前的Note，支持markdown
5. 搜索功能
   next.js 数据业务开发

## 技术分析

### 路由
规范驱动编程
规划需要哪些组件
组件是工作单元，ai生成的工作单元
开发之前不要急着写代码
分析需求，技术方案(next.js) 任务细节 路由+组件
  Sidebar
    SidebarSearchField EditButtion(复用)
    SiderbarNoteList
      NoteItem

  Note
    NoteEditor  编辑
    NotePreview 负责笔记的预览界面

### 目录结构
- app 
  页面主目录
  page.js
  layout.js
  [id] 
- components 组件
- lib
   数据库操作
   常用的函数
- public 
   静态资源static server

### 配置alias
 /app/notes/[id]/page.js
 引入 lib/redis.js
 相对路径 ../../../lib/redis.js
 短链接 @/lib/redis.js  alias
 baseURL
 path
   @/components/*
   @/lib/*

   @ 直接来到根目录

### BEM 国际命名规范
- 原子类 tailwindcss
- BEM
  Block 块
  Element 元素
  Modifier 修改器
- layout
    - html
    - nav 侧边栏，导航栏
    - children page.js


head
  title
  meta keywords description
body
  page.js
- nav 侧边栏，导航栏
- section 语义化标签
- children page.js
- to be continue 注释大法
  规划未来做的，有利于团队协作，记忆，维护，注释写好要做的事情

## 数据服务
- 选择了redis key:value 的NOSQL 内存数据库
6379 端口 没有数据表，不是关系型，不用SQL驱动，在内存中，有点像localStorage 直接
key:value 
  高级的地方 对不同类型的数据 有优化的存储方式 不同的方法
  字符串 直接get/set 哈希 hget/hset
 缓存、计数器、榜单、
 redis + MYSQL 数据库有读写的I/O瓶颈
 掘金首页，文章列表 几分钟之内可能是不变的
 第一个用户来的时候 查mysql 数据库 posts列表 key:value 存到redis中
 下一个用户来的时候 查redis 缓存
- lib 目录下redis.js 
  next.js 数据业务逻辑都放在lib目录下
  / -> lib notes -> sidebar ->seo 良好的导航
- /app/api/route.js？
  数据接口 rpc 远程调用