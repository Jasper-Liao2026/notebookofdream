# react 常用hooks
## useState
响应式的状态
## useEffect
副作用
## useRef
可变对象
- 可变，但不希望触发渲染？
- 绑定DOM 对象
react 不直接操作DOM
万一要操作DOM?

## DOM 编程
- js在v8引擎
- dom在渲染引擎
js里做DOM编程非常耗费性能
- react vue 之前 原生js 做DOM编程 
- react vue 新框架
直接规避dom编程，不需要dom编程，react框架帮我们做
useState 数据绑定+响应式编程

## 如果非要去DOM？
不是不可以做DOM编程
而是交给DOM useRef 来了
- useRef 申明一个可变对象 null
- jsx dom ref 属性绑定
current 指向 这个dom 节点对象
- useEffect 
- 和useState 相同点和区别点
都可以改变 useState 聚焦数据状态业务
useRef DOM 对象引用等
- useState 响应式的

## 总结定义
useRef是react 的一个提供持久可变对象的hook函数，经常用来引用DOM节点对象，他有一个current属性，可以指向任何值或对象，不会触发渲染

## useRef worker 对象

## js ？ 单线程
做一些前端交互，脚本工作，简单，显示和操作的页面，一致性，不能出问题，js如果是多线程可能就会有冲突

页面复杂起来，有很多任务要干，耗时任务，event loop js 异步执行机制
异步无阻塞，不要卡在这里

llm，游戏，非界面的业务逻辑，很耗计算时间，event loop异步
搞不定，用worker线程，接下来更耗时，复杂的任务，浏览器独立开辟的内存，复杂计算，完成之后告知主线程(消息机制)

## Web Worker 线程
浏览器提供给js可以调用的耗时性计算，或者llm、游戏等复杂任务的worker线程

JS单线程，event loop 机制 运行的代码，不适合某些复杂计算业务，html5提供的新特性。Web Worker线程
- 开启一个新线程
new Worker(
    new URL('./worker.js',import.meta.url)
)