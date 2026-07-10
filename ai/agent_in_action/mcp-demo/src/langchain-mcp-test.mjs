import 'dotenv/config';
//agent 配置 mcp client ? 可以配置多个server的client
import { MultiServerMcpClient } from '@langchain/mcp-adapters';
import {ChatOpenAI} from '@langchain/openai';
import chalk from 'chalk';
import {HumanMessage,
        SystemMessage,
        ToolMessage
} from '@langchain/core/messages';

const mcpClient =new MultiServerMcpClient({
    servers: {
        'my-mcp-server': {
            command: 'node',
            args: ['c:/Users/liaoh/Desktop/学习/ai/agent_in_action/mcp-demo/my-mcp-server.mjs'],
        },
    },
});
//获取工具
const tools = await mcpClient.getTools();
const modelWithTools=model.bindTools(tools);
async funtion runAgentWith