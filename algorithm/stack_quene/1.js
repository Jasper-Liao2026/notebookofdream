//函数表达式
//类MyQueue
//早期js没有类，不需要class也可以完成面向对象
//函数 + prototype 
const MyQueue=function(){
    console.log('实例化',this)
    this.stack1=[]
    this.stack2=[]

}
MyQueue.prototype.push=function(){
    console.log("push方法")
}
//new 运算符this指向实例
const queue=new MyQueue()
console.log(queue,queue.push())
