import 'dotenv/config';
import {ChatOpenAI} from '@langchain/openai';
import {JsonOutputParser} from '@langchain/core/output_parsers';
import {z} from 'zod';

const model = new ChatOpenAI({
    modelName:process.env.MODEL_NAME,
    apiKey:process.env.OPENAI_API_KEY,
    temperature:0,
    configuration:{
        baseURL: process.env.OPENAI_API_BASE_URL,
    },
})

const parser = new JsonOutputParser(
    z.object({
        name: z.string().describe('姓名'),
        birth_year: z.string(),
        nationality: z.string(),
        major_achievement: z.string(),
        famous_theory: z.string(),
    })
);

const question = `请用JSON格式介绍一下爱因斯坦的信息，必须返回纯JSON，不要有其他文字：
${parser.getFormatInstructions()}
`;

console.log(question);



const response = await model.invoke(question);
console.log(response.content);

const result = parser.parse(response.content);
console.log('解析结果:', result);