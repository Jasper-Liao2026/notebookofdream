# 全栈项目 Todos
## 前端后端职责和功能分离
- react + react-router + zustand(状态管理)
//前端项目独立开发
    响应式组件 + 路由 + 状态管理(银行)
    独立的前端应用
- 后端 node koa mysql 
  提供 api /todos json 数组

## 前后端协作
/api 接口请求
前后端分离的了吗？唯一一个耦合
前端要等后端提供的接口，渲染数据状态？
如何不耦合？前端怎么样做不用等后端的接口，先把界面写完 mockjs
后端把api 真正写完之后，再把请求切过去

## 前端接口 
前端可以独立做路由
前端也可以独立做数据接口(mock,开发阶段)
傻等后端给接口

/api 目录 所有的前端接口统一管理
- axios 标准请求库
    fetch/xhr App应用升级到axios

- 前端为什么需要api目录？
 - 后端接口往往不能及时提供
 - 前端接口层
  - 管理所有的接口
  axios 配置
  - 先伪造数据
  baseURL 一键切换
  前端工程里的一环，即api工程

## 前后端联调
- 前端独立的完成整个App
  axios 配置/api 前缀
  /api/todos 前端接口返回json 数据？
  目前没有这个前端接口

## mockjs

## 流程
前端需要数组状态，由数据接口提供
不能直接走后端数据接口，前后端分离，步调不一致
前端也需要独立完备整个应用开发工程系统，纳入了前端接口工程  
- api/目录 配置axios baseURL/api 
    前端一类路由是页面级别路由 pages/...
    现在还有前端接口路由/api 不是react-router-dom 处理的范围

mock目录
export default[
    {mockjs url:'/api/todos',method:'get|post',response}
]

- 开始
/todos 页面 响应式状态 todos 
接口  url http://localhost:5173/api/todos
http://localhost:3000/todos
axios baseURL 