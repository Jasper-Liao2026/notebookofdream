// 从tool-call zod shema 得到灵感，可以 直接tool-call?
import "dotenv/config";
import {ChatOpenAI} from '@langchain/openai';
import {z} from 'zod';

const model = new ChatOpenAI({
    modelName:process.env.MODEL_NAME,
    apiKey:process.env.OPENAI_API_KEY,
    temperature:0,
    configuration:{
        baseURL: process.env.OPENAI_API_BASE_URL,
    },
})

const scientlistSchema = z.object({
    name:z.string().describe('姓名'),
    birth_year:z.number().describe('出生年份'),
    nationality:z.string().describe('国籍'),
    fields:z.array(z.string()).describe('研究领域'),
})
//偏门
//llm调用的上下文
const modelWithTools = model.bindTools([
    {
        name:'extract_scientist_info',
        description:'从文本中提取科学家的信息',
        schema:scientlistSchema,
    }
])

// 这个工具不是为了直接调用，只做schema校验 而是为了方便后续的解析和处理
const response = await modelWithTools.invoke('介绍一下爱因斯坦');
console.log(response.tool_calls[0].args);
