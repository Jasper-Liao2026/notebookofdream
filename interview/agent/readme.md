# Agent 智能体 ？
字面意义上，AI会自己干活
这么理解没问题，但遮住了一个更重要的问题

Agent和普通的AI对话差别在哪里？
- 对话结构
普通对话：你问他答，一问一答结束
案例：帮我写一封邮件
llm 写完，任务就终止，输出一次，没有后续

- agent 不一样，他有一个持续运转的结构
你给他一个任务 他会去拆任务，决定下一步，去调用工具，看结果（这个过程是一个循环），直到任务完成，或者他自己判断（超出循环次数等情况）

## Agent 工作方式，核心三个动作
- 第一个动作 思考 Reason 
- 第二个动作 行动 ReAct
- 第三个动作 观察 Observe

一轮的，观察后再回到思考，再行动，再观察，循环往复，这个循环，就叫做ReAct
ReAct (Reasoning+ Act+ Observe)这是一套标准的Agent 执行流程/Agent工作框架，不是LangChain 那种大型开发库，是Agent通用的循环工作标准

## demo
帮我分析竞品，然后去写一份报告，agent会怎么做

- 第一轮他会思考（reason） 
    需要去搜索竞品的信息
    调用搜索工具(act)，去咨询三家竞品的最新动态
    查完之后把结果拿回来
    然后观察（observe） 信息量挺大
    到这里第一轮结束，接着下一步

    再回到思考，发现缺少财务数据(Reason)
    可以去官网或查股市API(Act)
    去抓取相应数据
    观察
    第三轮，第四轮.....
    最后一轮，把报告写完，交给我们

Agent最核心的动作，就是tool use
工具是agent的手和脚，没有工具，他只能在脑子里转，转完之后，还是只有文字
常见的工具：
- 搜索工具，能上网查实时信息
- 代码执行器，能运行代码，能看结果
    Anthopic 最牛逼的Agent 企业，代码是最标准，又完善的工程化验收机制，ai 测试agent 
- 文件读写I/O 
- 浏览器的操控browser 打开网页，点击提交
    manus 
- API调用 
工具越多，agent能干的事情越多
很多agent产品，调用了很多工具，工具的覆盖范围直接决定了agent的能力边界，选择agent的核心

## AI 工程
- 工程目录
    根目录 package.json node_moudles
- src 开发代码目录
    - promise 特性
    asyn 函数 就是promise实例，return resolve并且return 的结果就是

## 总结第一个编程助手agent
tools声明(async fn+schema(zod))
invoke 执行(message,tool,..)
4种 Message 派生类
modelWithTools llm 工作流 coze 节点之间连线
langchain 工作流 ChatOpenAI ->tools -> bindTools ->invoke llm工作流框架

- 不停维护messages数组
- llm reason 不能直接生成，直接返回带有tool的消息

- Promise 升级
    async 函数执行完之后 是promise return resolve值
    Promise.all   find,map
    if(tool)
    try catch

# 手写ai 编程agent trae/cursor 为例
使用cc 完成以下的项目
"用vite创建一个react的todolist项目，并且把它运行起来"

- 编写一个cli命令执行工具