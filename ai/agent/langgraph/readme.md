# LangGraph

## 为什么需要多agent
复杂的agent产品基本都是多agent架构
- langchain 工作流编排  线性的
- langgraph 工作流编排  网状的
- 上下文的开销
    单agent框架下，所有tool的描述，每个功能的prompt 都放到system prompt里
    实际上执行每个功能只需要一部分prompt，但是每次都带上
    token消耗更高，更重要的是很多无关信息干扰，思考效率低且容易出错
- 如何拆分多个agent？
    每个agent 只保留需要的prompt，执行功能的时候，消耗token更少，没有无关信息干扰，准确率更高
    Agent = LLM + Harness(tool +mcp +rag+skill..+...)
    单agent只有一个llm大脑 需要一步步思考，调用tool
    规划
    多agent 多个大脑，并行思考
    主agent 下发任务，子agent 并行处理完成后返回
    每个打大脑需要选择合适的模型
    agent组合式，按需加载，动态加载
    多agent分工合作，编程agent负责写代码，让测试agent编写测试代码tdd
    让 agent验证代码是否符合语气，告诉主agent通过了

基于三个原因
- 决策准确性高，token消耗低
每个agent只要带必要的最少prompt，没有多余信息干扰
调用llm 次数多，但更省token
- 并行思考和任务处理
    主管分派子任务，子agent并行处理，整体效率更高
- 多角色互相讨论，纠错能力更强


## Langchain -> LangGraph
- llmapi,document loaders,splitter,embedding,vector,store,output,parser,memory...基础模块
- langchain 线性工作流编排
- langgraph 网状工作流编排
- 工作节点 + 组织方式
- 简单agent -> 复杂多agent协作

## 网状工作流编排 API
- 工作节点
  职责 状态
- 链接工作节点
  边
- 工作节点
  最终状态

## 分支 循环
- **`eval()` 会把传入的字符串当作js表达式，返回计算结果**


## 持久化我们的状态
不要每次重新执行

用MemorySaver 来把state 保存到内存里，下次就会基于上次的state继续执行
agent执行中断，失败...暂停，需要授权，MemorySaver 保存状态，之后继续运行

保存到数据库 sqlite，redis 持久化

## harness 中断