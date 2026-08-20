# nestjs

next.js全栈 ，nestjs就是node的纯后端企业级开发框架
默认使用typescript 开发，全面模块化思想，适合构建企业级服务

## 后端开发做些什么？
- 提供api 接口 web 开发
- 系统集成，并发，底层服务，AI Infra
- 微服务

## 安装
npm i -g @nestjs/cli

# 目录架构
- src
  main.ts入口文件
  app.moudule.ts 根模块
## 工厂模式
## 高度模块化
  约定
  APP -> Modules 
            -> @nestjs/common Module 类
            -> import 依赖项
            -> controllers 控制器 参数校验，简单逻辑 return response
            -> services 数据服务 return 数据

## 装饰器模式
装饰器模式在不修改原有对象的前提下，动态给对象叠加额外功能
@
class