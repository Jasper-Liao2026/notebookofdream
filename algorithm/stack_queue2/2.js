const stack=[]
stack.push("巧乐兹")
stack.push("兵工厂")

//出栈的代码
while(stack.length){
    const top=stack[stack.length-1]
    console.log(`取出来的是`,top)
    stack.pop()
}