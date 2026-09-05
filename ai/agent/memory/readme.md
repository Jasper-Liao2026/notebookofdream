# Memory 管理

Agent = LLM + Harness (tool+RAG+memory+...)
给模型扩展tool，不只是回答问题，干活
RAG，居于query 获取向量数据库相关的只是放入prompt
都依赖于Memory

大模型是无状态的，基于上次的回答继续问，问答
之前已经通过chatMessages 做了简单的Memory 管理

- 持久化
- 上下文窗口大小 200k?
- /compact 总结 /clear

Agent 执行流程ReAct ，messages 数组-> Memory

上下文大小、开销、持久化
Memory 三种思路 截断(slice(-4))、总结、检索
临时记忆 
长期记忆

用InMemoryChatMessageHistory 来管理message 放到内存里
用addMessage 添加HumanMessage,AIMessage,toolMessage
调用大模型，返回AIMessage直接添加到history
getMessage() 获取所有message 每个message对象
