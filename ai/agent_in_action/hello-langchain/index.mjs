import { ChatOpenAI} from '@langchain/openai';
import 'dotenv/config';

const model = new ChatOpenAI({
  modelName:'deepseek-v4-pro',
  apiKey: process.env.DEEPSEEK_API_KEY,
  configuration: {
    baseURL: 'https://api.deepseek.com/v1',
  },
});
//client.chat.completion.create
const response = await model.invoke('鸡你太美')
console.log(response.content)