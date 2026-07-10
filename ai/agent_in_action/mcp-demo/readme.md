# MCP
- 这里的tool有什么问题？
1.只能在我们这个项目里面使用，不能在其他项目里面使用
2.node 写的，如何在java/python/rust 写的tool呢？

tool独立于llm，本地/远程 跨进程、跨语言应用

## MCP协议
Model Control Protocol
- 标准化llm 与tool和资源之间的通信
    llm 和 tool 解耦
- 基于 stdio 标准输入输出流，键盘输入、控制台输出，当一个进程(agent)调一个子进程(node child_process) 或其他语言进程时，可以通过stdio 标准输入输出流，实现进程之间的通信
- http 远程通信 MCP 掌管

不管是本地工具，还是远程工具，agent想**跨进程**调用某个工具，通过MCP协议就行
是给Model扩展Context 上下文，让他能做的更多，知道更多(resource)的Protocol 协议

## MCP 特点

MCP 最大的特点就是可以**跨进程**调用工具
跨本地的进程调用，就是stdio
跨远程的进程调用，就是http
ai agent 是MCP客户端(host)，可以通过MCP协议调用各种MCP Server，clients 配置添加，实现跨进程的工具调用
他和fetch 不同 不是接口调用 不是拿接口数据，他是要扩展Context (tool&resource) 

## MCP Tool
