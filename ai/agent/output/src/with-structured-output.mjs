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


//tool call 讨巧的做法
const structuredModel = model.withStructuredOutput(scientlistSchema);