# 浏览历史

## 路由 Route
- navigator 对象
- 浏览器 url
    - url 浏览器 访问代理
    - http 协议 server 发起请求
    - server 伺服状态 给予相应
    - 浏览器拿到响应数据 渲染页面
    - 浏览历史插入一条记录

## 链接
万物互联靠链接
<a href=""></a>
多了点啥？
传统页面，每次都要重新渲染 整个页面
慢，没有必要重新渲染整个页面
移动时代，app 体验不一样
单页应用 Single Page Application
SPA 

传统多页面 每次都要重新渲染 移动端时代就有点没必要了 

访问体验提升
怎么把丰富的内容在一个网页里显示?
DOM 编程？
根据相应的url
/index.html  content DOM放到
#container
/about about.html content DOM放到
#container 

## 单页应用
- 点击链接跳转
    - url 和 资源是一一对应
    不只是DOM编程
    怎么改变url
    hash 方式可以做到
    改变hash ，url 改变了，不会跳转

## Hash 路由
http(s)://www.baidu.com/u/123?a=1&b=2
 protocol   host    path   queryString
url 中，hash部分 # 开始 
- url 一定要变，不同url对应不同的资源
- 监听变化 根据hash 部分 渲染不同的内容
优点是url改变了(局部) ,页面不会刷新

锚链接
hash作为url的一部分，标记传统PC长页面某一部分，坐电梯一样直达
做前端路由 #/ #/about  不会重新渲染，又能满足url 和资源的一一对应关系，前端路由，当hash部分改变的时候 hashchange事件，dom或组件替换

## 路由对象
- SPA 需要前端路由
- url改变，对应不同的资源resetful设计理念
hash #/pay browserRouter history
- navigator 导航栏
- location 地址栏
- history 历史记录
- Link 组件
    to 
    replace