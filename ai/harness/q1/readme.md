# Harness 工程
用工程化手段，进一步解决llm 幻觉和落地问题
harness 是一种将llm 生成(让大模型当评委)，自动评测，择优筛选串联成闭环流水线编排框架，像被马具(harness)驾驭的马一样，结构化流程中自动产出更高质量的结果
ReAct Agent的思维框架，

这是一个LLM as Judge + Best of N Sampling 组合的harness模式

核心思想：
1. Best of N Sampling 并行生成多个候选代码，通过随机性覆盖更多可能性
2. llm as judge 用llm充当自动化评分器，替代人工评测，实现闭环自动化
3. harness抽象 将生成、评测、择优三阶段解耦为流水线

# Harness Engineering

用工程化手段，让AI Agent可靠，持续完成任务
智能体工程AI Agent Harness

AI 应用开发工程师 Agentic RAG 应用
AI Agent 开发工程师 Harness Agent FDE

## 包含6个基础模块
- Loop 主循环 
  自主长时间干活
  ReAct 
  核心控制层，调用LLM ，分发工具调用，判断任务终止条件
  Agent的主执行流
- Tool 工具集 llm 能使用的工具集
- Context 上下文管理器
  无状态，
  输入给模型的全部内容：系统提示词、历史对话、Rag、es上下文
  工具返回结果 上下文压缩 窗口控制
- Environment 沙箱环境
  工具运行时的隔离环境，文件系统、网络、权限、工作区隔离
- Memory 记忆层
  跨轮次、跨会话状态持久化状态、短期记忆+长期记忆
- Observability 可观察性
  日志(分析)、Trace、评估指标、调试、回放、评测

除了6个基础模块，包含一些可拔插的高级模块
- sub agents
  - 职责清晰 拆分
  - 上下文互不干扰
  主agent分配任务给子agent
  子agent像子进程 上下文不被打扰
  主Agent 也不会因为子agent 的运行，上下文受到拖累

- hooks
- Police & Safety 安全与策略层
  权限、输出过滤、资源配额、

6大基础模块是最小内核；sub-agent 属于高级编排的扩展模块
不是底层必选，但现代agent harness 工程体系普遍把他作为标准模块

- Agent A 写前端
- Agent B 写后端
- Agent C 写测试
- Agent D 部署

## Sub Agents 子智能体
- 清晰的任务分配
- 独立不受影响的上下文
  主agent
    负责分配任务和检查 上下文不应收到太多细节的干扰
    派发任务给子agent 独立的运行上下文
    按需加载tools，不用一次性加载那么多

## 为什么是Agent 而不是workflow？
固定workflow 是预先写死的步骤(23-25年，较为固定，简单任务)，只能按预设路径执行，无法应对不确定，动态变化的任务
多Agent(含sub-agent) 可自主拆解任务，按需调用能力，根据中间结果调整执行分支，适合需求模糊，存在未知问题的复杂场景
具备更强的自适应与容错能力

### 举例
做一份技术调研报告生成：
- 任务需求 简单版本 workflow 
  问题 -> 行业关键字 -> 技术关键字 -> 上网搜 -> 分析 -> 生成报告
- 任务是专业的
  分析需要哪些agent？
  - 主agent 负责任务拆解与整体调度
  - 子agent 负责检索资料
    反扒、爬取资料的优劣
    自动分析，切换数据源
  - 摘要agent
  - 校验
    不要全信资料，网上有些要分辨的
  - 行业内大佬的联系方式找到
  - 生成报告Agent

## sub Agents 业务
- 专属SYSTEM prompt
  多个system
  主system 规划，分工
  子system 执行任务
- 子进程
- 独立的上下文
- 子agent 返回结果，有全新的上下文，不会干扰主agent上下文
- 主agent 怎么将任务交给子agent的