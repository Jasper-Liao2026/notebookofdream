# 如何用栈模拟队列
线性
    栈、队列、链表
非线性
    树
- 栈 stack
    FILO
- 队列 Queue FIFO 先进先出
push() 将应该元素放入队列尾部
pop() 从队列首部移除元素
peek() 查看队列首部元素
empty() 判断队列是否为空

## JS 的面向对象
- 不走寻常路
    不需要class也可以完成面向对象
    函数是一等对象
    普通函数
    new +构造函数
    this 指向新创建的对象
    原型式的面向对象
     js没有类 只有对象 MyQueue 对象
     MyQueue.prototype  也是一个对象
    
## new 的过程
- 创建一个空对象，this指向新创建的对象
- 构造函数执行，this上添加属性，实例也就有了这些属性
- 构造函数有一个prototype属性，指向原型对象
  原型对象上有的方法，实例也会有
- 

## JS 设计哲学
- 一切皆是对象，没有类
- Object 是顶层对象
    按照原型式的面向对象来设计
    Object()函数对象
    Object.prototype 原型对象
    Function\Array\Data\RegExp 函数对象
    下一站 Object 原型链

- 实例对象有_proto_私有属性，指向原型对象
- 沿着_proto_ 一直找，沿着原型链找
终点是null
- 任何函数有prototype属性，指向原型对象
- 实例先在自身查找属性，再沿着原型链查找属性或方法
- 任何对象，要不原型直接是Object.prototype，要不终点前一定是Object.prototype