// llm client 对象
import {OpenAI} from 'openai'
import dotenv from 'dotenv'
dotenv.config()
const client=new OpenAI({
    apiKey:process.env.DEEPSEEK_API_KEY,
    baseURL:process.env.DEEPSEEK_API_BASE_URL,
})
export default client;

