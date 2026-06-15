# 栈和队列
基于对数组的理解和掌握，线性数据结构(栈、队列和链表)

非线性数据结构，树&图

## 线性数据结构
- 数组和链表
数组 开箱即用 连续存储 下标访问
链表 不连续
- 栈和队列


## 栈和队列特性
看成操作受限数组，特殊的数组
栈只能在栈顶操作、数组的尾部操作 LIFO
队列只能在队尾入队，在队首出队 FIFO
也可以用链表来表达

## 灵活增删的数组
- 增加元素的方法
push unshift splice
push 数组扩容的问题 链表没有这个问题
unshift 内存视角
splice 删 或 增(slice+replace)
(start_index,del_count,...added)

## 栈 stack
LIFO Last In Fist Out 数据结构 **特殊**数组

类似于冰柜里的雪糕
push/pop受限的操作 peek length-1
while(stack.length)


## 队列 queue
- 受限 push/shift
