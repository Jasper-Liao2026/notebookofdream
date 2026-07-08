// 手写 mini cursor
// 使用vite 基于react 创建一个todolist 项目
//给我目录列表
//编程agent自动化
import 'dotenv/config'
import { ChatOpenAI } from '@langchain/openai'
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  ToolMessage
} from '@langchain/core/messages'
import {
  executeCommandTool,
  readFileTool,
  writeFileTool,
  listDirectoryTool
} from './all-tools.mjs'


const tools=[
  readFileTool,
  writeFileTool,
  listDirectoryTool,
  executeCommandTool
]
// lang + chain(链)
const model = new ChatOpenAI({
    model: process.env.DEEPSEEK_API_MODEL,
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: { baseURL: process.env.DEEPSEEK_API_BASE_URL }
})
const modelWithTools = model.bindTools(tools)

const case1 = `创建应该功能丰富的React TodoList 应用：
1.创建项目：pnpm create react-todo-app --template react-ts
2.修改src/app.tsx，实现完整功能的TodoList：
- 添加、删除、标记完成
- 分类筛选（全部/进行中/已完成）
- 统计信息显示
- localStorage 数据持久化
3.添加复杂样式
- 渐变背景（蓝到紫）
- 卡片阴影，圆角
-悬停效果
4.添加动画：
- 添加/删除时候的过渡动画

5.列出目录确定

注意：使用pnpm，功能要完整，样式要美观，要有动画效果 
之后 react-todo-app 项目中：
1.使用pnpm install 安装依赖
2.使用pnpm run dev 启动项目
`
// Agent 执行函数 ReAct 
async function runAgentWithTools(query,maxIterations=30){
  const messages=[
    new SystemMessage(`你是一个项目管理助手，使用工具完成任务。当前工作目录：${process.cwd()}
    工具：
    1.read_file读取文件
    2.write_file写入文件
    3.execute_command执行命令（支持workingDirectory参数）
    4.list_directory列出目录
    重要规则 - execute_command：
      - workingDirectory 参数会自动切换到指定目录
      - 当使用 workingDirectory 时，绝对不要在 command 中使用 cd
      - 错误示例: { command: "cd react-todo-app && pnpm install", workingDirectory: "react-todo-app" }
      这是错误的！因为 workingDirectory 已经在 react-todo-app 目录了，再 cd react-todo-app 会找不到目录
      - 正确示例: { command: "pnpm install", workingDirectory: "react-todo-app" }
      这样就对了！workingDirectory 已经切换到 react-todo-app，直接执行命令即可

回复要简洁，只说做了什么`),
    new HumanMessage(query)


  ]
  //ReAct 循环
  for(let i=0;i<maxIterations;i++){
    const response = await modelWithTools.invoke(messages)
    messages.push(response)
    if(!response.tool_calls||response.tool_calls.length===0){
      console.log(`\n AI最终回复：\n${response.content}`)
      return response.content
    }
    for(const tool_call of response.tool_calls){
        const foundTool = tools.find(t=>t.name===tool_call.name)    
        if(foundTool){
          const toolResult = await foundTool.invoke(tool_call.args)
          messages.push(new ToolMessage({
            content: String(toolResult),
            tool_call_id: tool_call.id,
            name: tool_call.name
          }))
        }
      }
  }
  return messages
}

try{
  await runAgentWithTools(case1)
}catch(err){
  console.log(`\n 错误：${err.message}`)
}

