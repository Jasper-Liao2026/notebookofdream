# deepseek-r1-webgpu

## 端侧模型
有别于OpenAI\Deepseek api 调用，llm在远程，和调用客户端不在一起
- 贵
- 不安全
    context 会随着请求发送到

ollama 本地开源模型部署，在用户端，端侧模型。
手机端，汽车端，Agent 任务划分的
开源小参数模型就能完成这些任务
浏览器端，随时下载，随时使用
webgpu 

## React + TS 
AI 时代的大型项目首选前端技术
    - react 比 vue 难入门
    - 大型项目
    - AI 训练代码 react的偏多

### 新建项目
react + ts + eslint(代码约束，大公司必备，代码风格一致)

## tailwindcss
几乎不再需要写css，原子css类

## react 组件
搭积木的方式搭建页面，是由一组html,css,js组合在一起，成为一个组件，一个功能单元
vue template script style 一个文件
react  是封装一个组件（函数）函数就是组件
  函数 返回html 就是组件

## React 合成事件
- onClink 最原始的 DOM0级事件监听
    html,css,js 三剑客不要耦合在一起，模块化分离
- DOM 1
    DOM n? html标准的执行迭代
    DOM 1 这个版本没有和新事件有关
- addEventListener DOM2级事件监听
- 同一个dom 元素可以多次监听同一事件
- react 代码洁癖 ，能不发明新概念就不
    @事件绑定....  vue
    react 直接用已在的概念
    onClick 作为高手没有学习成本
- react 里面的事件并不是原生事件，是合成事件

    {/* 循环输出 v-for vue react 绝对不去发明
              map？一个数组返回一个新数组
              原来是json数组 => 渲染的精度条jsx*/}


## 封装进度条组件
比较独立，可复用的业务模块
把它单独的从App.vue 中抽离出来，作为组件

## 组件树
- 代替DOM树
- 基于组件封装，组件树
    一眼能看出页面的组件构成
    页面组件化程度、粒度
    前端发展的必然
    页面及交付越来越复杂，组件作为开发的最小单元
    团队好协作，好复用，好维护

## 进度条组件
- 容器%100 
- 子元素(进度条，宽度props percentage来长大的)

## 进度条组件
- 容器 100%
- 子元素(进度条，宽度props percentage 来长大的)
设计组件
percentage 使用 es12 提供的空值合并运算符
??=0 当percentage 为空则赋值为0
如果传了呢？传入的值，不赋值
初始化的时候，没有下载进度这个概念的，组件里使用??=空值合并，赋值为0

封装者多考虑，使用者用的爽

## 两种数据状态
- state 数据状态
    useState 申明 组件自有状态，组件自己打理
- props 数据属性
从父组件传递到子组件的属性，不能在子组件里修改
报告父组件才能修改
- 子组件主要负责展示，父组件给什么props 就显示成什么样子
- 组件封装和健壮性 做的可以

