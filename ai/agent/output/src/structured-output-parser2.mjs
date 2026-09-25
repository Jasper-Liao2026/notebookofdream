import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { z } from 'zod';

const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  }
});

const schema = z.object({
  name: z.string().describe('姓名'),
  birth_year: z.number().describe('出生年份'),
  death_year: z.number().describe('死亡年份'),
  nationality: z.string().describe('国籍'),
  occupation: z.string().describe('职业'),
  famous_works: z.array(string()).describe('著名作品列表'),
  biography: z.array(z.string()).describe('简短传记'),
});

const structuredModel = model.withStructuredOutput(schema);

const prompt = `详细结束莫札特的信息。`;
console.log(`流式 结构化输出演示`);
try {
  const stream = await structuredModel.stream(prompt);
  let chunkCount = 0;
  let result = null;

  console.log(`接收流式数据...\n`);
  for await (const chunk of stream) {
    chunkCount++;
    console.log(chunk);
    result = chunk;
    console.log(JSON.stringify(chunk, null, 2));
  } 

  console.log(result);
} catch(err) {

}