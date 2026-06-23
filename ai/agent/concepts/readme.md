# 入手AI，需要搞懂哪几个关键概念？

## Agent（智能体）
现在最值钱的就是Agent，Agent 工程师已经取代传统软件工程师，刷新工资上限

FDE 通过开发各种Agent，帮助企业AI落地，降本增效，现在用的很多AI产品本质是Agent Cursor/Claude Codex/Code/豆包/悟空/openclaw/hermes/workbuddy/飞书cli，核心都一样，能够帮我们干活，不只是回答问题，还能读文件、搜网络、操作浏览器、电脑，都是Agent在做

- 一个Agent 有多强？ 取决于 用了什么大脑（llm），装了什么工具，拿到了什么信息

## LLM
大模型 是Agent的大脑，豆包背后字节的大模型，claude Anthorpic
LLM 只负责 **推理** 和生成 ，真正的行动能力来自工具的调用

## 工具 Tool
LLM 只有推理能力，无法对接外部世界，tool可以补齐操作短板，没有tool，AI只有空推理，无法完成自动化任务

- reasoning 推理
给出llm 规划和思维，方便我们了解和介入
- messages 多轮对话列表
- reasoning_effort:'high'
- reasoning_content 推理过程 指导生成，流式输出
- content 

- 青岛啤酒股价多少？
llm 推理 要调用工具
getPrice 函数 得到结果再返回给llm，llm就知道怎么回答这个问题
llm with tools? 
openai 提供了接口 tools
tool 函数 （llm 理解需要的参数）
结果交给llm，再completion一次
