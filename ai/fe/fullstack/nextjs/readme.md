# 大前端手里的nextjs
Next 是 React 全栈框架，Nuxt 是Vue的全栈框架，Nest 是 后端框架
NextJS 适合做全栈项目，可以写页面(前端)，也可以写api(后端)
背靠Vercel,seo做的非常棒，很多ai产品用next.js做官网

## SEO 搜索引擎优化
SPA 的短板
体验很好，组件是在前端挂载的(useEffect去异步请求数据)，不需要刷新页面，前端路由的支持，让页面切换效果快、好
SPA的短板
像Native 移动端App Android IOS Appstore
SPA 抄的原生APP 体验做的和APP一样
APP 里已经有80% 是用spa做的

SEO 非常差，没有SEO  

根本就不是为了SEO

AI发展，OPC 产品多如牛毛，AI Agent 产品站点

主流的SPA 开发之外，全栈SEO 良好的next.js

## 创建全栈项目
npx create-next-app@latset
选择是默认配置
nuxt react 框架
react/react-dom react 界面
typescript
tailwindcss
eslint 代码风格规范

GEO Generative Engine Optimization
用户入口：豆包
生成的时候，带上我们的内容，购买链接
- SEO 友好 怎么实现？
 - SPA #/todos
    Routes
        Route path ="/todos" element={<Todos />}
    懒加载Todos 组件，在前端(client) 挂载 (#root)，不需要刷新页面
    index.html #root script src ="main.js"
    CSR Client Side Rendering 客户端渲染
    Server 前端项目所在的服务器 / index.html
    爬虫通过url 来爬取的时候 #root script
    Client 用户的浏览器 用户看得到页面 ,main.js App.jsx Todos.jsx 在client端的运行 CSR Client Side Rendering 客户端渲染

react js node的形式:
react 组件 只要不做事件监听，不做useEffect，组件函数 + todos 数据 模板的编译在一起就好
服务器端不是dom，是字符串的格式化
前后端分离 /todos api todos json 数组
全栈项目 /todos 返回的就是react组件编译过后的html
    jsx+todos(数据) = 服务端ui html
    SSR Server Side Rending 服务端渲染


## CSR 和 SSR 
SEO 的根本 
组件到底在哪里渲染
CSR Client 浏览器 SPA
SSR Server 服务器 Next.js

## next.js 语法
约定大于一切
- App Router
不需要建，文件就是路由，嵌套路由 建立文件夹

page.jsx 就是页面
nav 共用的，layout.js布局文件
next.js 是给react开发者的开箱即用的利器

渲染规则:
/about 后端路由
/about/page.tsx 组件的编译 tsx -> html
- 先到layout.tsx 布局
    - page.tsx

## SEO 的基本做法
第一层 你是谁？做什么的？description 有什么价值提供keywords
<meta name = "description" content="这是一个描述">
<meta name = "kaywords" content="这是一个关键词">
第二层
做内容 用户来的原因
第三层
ssr 服务器端渲染
/post/:id 一个页面  千万篇 ssr 整站被seo收录的内容给你的加权

## 客户端组件
next.js 将react server component 带到 服务器端渲染
jsx -> html seo
有些页面 强交互 
'use client'申明
不是只在浏览器渲染，现在服务器端能渲染的渲染完，再去客户端渲染

# 大前端手里的next.js 
csr 组件会执行两次，一次在服务器，第二次是在客户端，打补丁