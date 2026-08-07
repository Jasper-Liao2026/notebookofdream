# 路由
- restful 一切皆为资源
- 前端路由负责切换页面，
    以前是要后端路由支持， 传统，慢，白一下，体验不好
    前后端分离、SPA hashRouter 
    hash 锚链接 改变url hash 部分不会刷新页面
    hashchange事件

## React 集成
React 开发全家桶
- React 组件开发，响应式等 UI界面
- React-router-dom 给应用添加路由(前端) SPA
- zustand pinia 状态管理
    hashRouter


## 各种路由
- 基本配置
- 路由懒加载
    首页/页面加载速度 非当前路由页面
    性能优化
- 动态路由
- 404 Not Found

- 有状态？
    - 请求头 token Authorization 
    - Cookie小饼干
    - localStorage 存储 login 状态
    user admin
    password 123456
- 组件内部的子组件
    props.children 拿到组件申明的内部所有的子节点
    model 弹窗组件  mask 蒙层
    窗体 头部，尾部 主题部分children传入
    定制性
    <Model>
    {children 定制}
    <Model>

## 路由两种选型
- hashRouter
    url 局部改变 hash 部分
    url 有点为了前端路由，url有点丑，后端路由不太一样
    /pay   #/pay
- BrowserRouter 不用hash方案实现SPA
    
