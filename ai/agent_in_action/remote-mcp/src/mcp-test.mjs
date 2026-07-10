import 'dotenv/config';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import chalk from 'chalk';
import {
    HumanMessage,
    SystemMessage,
    ToolMessage
} from '@langchain/core/messages';

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

const tools =await mcpClient.getTools()
console.log(tools)
const modelWithTools= model.bindTools(tools)

async function runAgentWithTools(query,maxIterations=30){
  const messages=[
    new HumanMessage(query)
  ]
  for(let i=0;i<maxIterations30;i++){
    console.log(chalk.bgGreen(`第${i+1}轮迭代`))
    const response =await modelWithTools.invoke(messages)
    if(!response.tools_call)
  }
}
