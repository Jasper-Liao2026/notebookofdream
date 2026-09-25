# Agentic RAG
AI Agent全栈开发岗
- 用什么向量数据库
milvs  ts
gdrant python
pipecone
...
## RAG
公司内部的Agent 基本都要用到RAG
llm能思考，但不知道公司内部的文档，我们需要基于内部文档来回答
这个流程太固定，有缺点
- 所有问题都走RAG检索？简单问题不需要检索，浪费资源

llm 规划能力 拆分 分步骤


## Agentic
自主规划，更智能，评估
langgraph 设计一个graph表示Agentic RAG流程
- 所有问题走RAG检索？简单问题不需要检索，浪费资源
    两个分支，一个简单问题，一个复杂问题
    llm来判断
- 没有纠错和评估机制，无法判断检索内容是否精确，是否足够
    llm 评估函数
- 处理不了需要多步检索的复杂问题，比如先查A，再查B，再查C，最后回答
