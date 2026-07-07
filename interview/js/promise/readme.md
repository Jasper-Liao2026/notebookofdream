# Promise
- make a promise
    new Promise
    Promise{<pending>} 待处理....
    fullfilled | rejected 不能再变

- rejected 可能性
    只有一个失败，整体失败，不再等待其他promise执行
    走catch 第一个失败的原因

## Message
SystemMessage 设置ai是谁，可以干干什么，有什么能力，以及一些回答，行为规范等...
HumanMessage
AIMessage
ToolMessage 调用工具的结果返回
Tool id