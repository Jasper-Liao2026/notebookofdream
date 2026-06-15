# JS 同步和异步
## JS 有哪些异步任务
cpu执行时间 不能霸占，几十毫秒为单位的轮询分配给进程的执行时间
进程则是董事长 PID process
线程是经理 Thread
主线程、还可以启动子线程

- c++,java 等系统级别语言有多进程多线程架构，执行效率高，但是复杂
- js简单，设计为单线程
    遇到setTimeout等事件

## JS 执行机制
-   前端script 或后端 node/bun 代码执行
-   启动一个进程 有独立的PID 负责分配资源
-   进程启动一个主线程
    js足够简单，单线程
- 先把同步任务快速执行掉

- 还是有定时器、fetch请求、事件等耗时性的异步任务 Async task
- js 会把他们放入event loop中跳过，先执行后面的同步代码，等同步代码执行完之后，再到event loop中把异步代码拿出来执行

## 如果需要控制执行流程 
A fetch user api 所有的用户
B fetch 每一个用户

## 理解Promise
- 实例化Promise
- 需要传递一个函数，executor
    会立即执行，是耗时性任务的容器同步，里面可以容纳异步任务  会得到resolve reject 两个函数能力
- resolve 表示异步任务
    then 被调用
- reject 表示异步任务失败了
    catch 被调用
- 在executor 里面的异步任务成功解决或异常时，手动调用
- resolve(result) 传给then
- reject(err) 失败的原因