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
ToolMessage 调用工具的结果返回Tool id

原生openai 返回工具调用 additional_kwargs ->tools->每个tool langchain invoke 原样输出上面的，同时还会细心的准备tools加到后面llm工程开发的便捷性，可读性 