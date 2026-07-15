import dotenv from 'dotenv';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import chalk from 'chalk';
import {
    HumanMessage,
    SystemMessage,
    ToolMessage
} from '@langchain/core/messages';

dotenv.config();
dotenv.config({ path: '../mcp-demo/.env' });

const model = new ChatOpenAI({
  modelName:'deepseek-v4-pro',
  apiKey: process.env.DEEPSEEK_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: 'https://api.deepseek.com/v1',
  },
});

const mcpClient = new MultiServerMCPClient({
    mcpServers: {
        'amap-mcp-server': {
            "url": "https://mcp.amap.com/mcp?key=f58f8879063a5f61df94bbb40a6305cb"
        },
        'my-mcp-server': {
            command: "node",
            args: [
                "C:/Users/liaoh/Desktop/学习/ai/agent_in_action/mcp-demo/src/my-mcp-server.mjs"
            ]
        },
        'filesystem': {
            command: 'npx',
            args: [
                '-y',
                '@modelcontextprotocol/server-filesystem',
                // 允许访问的文件夹，可以配置多个，用空格隔开
                'C:/Users/liaoh/Desktop/学习/ai/agent_in_action/remote-mcp'
            ]
        },
        // Chrome‑DevTools MCP，默认连接本地打开的Chrome（开启远程调试：chrome --remote-debugging-port=9222）
        'chrome-devtools': {
            command: 'npx',
            args: [
                '-y',
                'chrome-devtools-mcp@latest',
            ]
        }
    }
})

const tools = await mcpClient.getTools()
console.error(`已加载 ${tools.length} 个 MCP 工具：`)
console.error(tools.map(tool => `- ${tool.name}`).join('\n'))
const modelWithTools = model.bindTools(tools)

async function runAgentWithTools(query, maxIterations = 30) {
  const messages = [
    new HumanMessage(query)
  ]

  for(let i = 0; i < maxIterations; i++) {
    console.error(chalk.blue(`第${i + 1}次迭代`))
    const response = await modelWithTools.invoke(messages)
    messages.push(response)

    if(!response.tool_calls || response.tool_calls.length === 0) {
      console.error(chalk.bgRed(`AI回答: ${response.content}`))
      return response.content
    }

    console.error(chalk.bgBlue(`工具调用：${response.tool_calls.map(t => t.name).join(', ')}`))

    for(const toolCall of response.tool_calls) {
      const foundTool = tools.find(t => t.name === toolCall.name)
        if(foundTool) {
          let contentStr
          try {
            const toolResult = await foundTool.invoke(toolCall.args)
            // mcp tool 返回一般字符串
            // haiyoukeneng 处理对象
            if(typeof toolResult === 'string') {
              contentStr = toolResult
              // str
              // filesystem {text}
            } else if (toolResult && toolResult.text) {
              contentStr = toolResult.text
              // str
            }
          } catch (error) {
            contentStr = `工具 ${toolCall.name} 调用失败：${error.message}`
          }
          messages.push(new ToolMessage({
            content: contentStr,
            tool_call_id: toolCall.id,
          }))
        }
    }
  }

  return messages[messages.length - 1].content
}

try {
  await runAgentWithTools("北京南站附近的酒店，最近的 3 个酒店，拿到酒店图片，打开浏览器，展示每个酒店的图片，每个 tab 一个 url 展示，并且在把那个页面标题改为酒店名");
} finally {
  await mcpClient.close();
}
