import "dotenv/config"
import Redis from 'ioredis'
import * as readline from "node:readline/promises"
import {stdin,stdout} from "node:process"
import {ChatOpenAI} from "@langchain/openai"
import {
    createAgent,HumanMessage,summarizationMiddleware
}from "langchain"
import  {
    mapChatMessagesToStoredMessages,
    mapStoredMessagesToChatMessages,
}from "@langchain/core/messages"

const REDIS_HOST = process.env.REDIS_HOST ?? 'localhost';
const REDIS_PORT = process.env.REDIS_PORT ?? 6380;
const REDIS_DB = process.env.REDIS_DB ?? 0;
const MEMORY_TTL = Number(process.env.MEMORY_TTL_SECONDS??1800);
const KEY_PREFIX = process.env.MEMORY_KEY_PREFIX ?? 'agent:short_memory:';
const SESSION_ID = process.env.SESSION_ID ?? "demo_user_001"

const summaryPrompt = `你是对话摘要助手，请用中文总结以下对话，包含：
1.讨论的主要话题
2.用户提到的重要事实(姓名、偏好、日期等，务必保留原文信息)
3.继续对话所需的关键上下文
保持简洁、不要编造，不要遗漏用户明确说过的信息
待摘要的对话：
{message}

摘要：
`

class RedisMessageStore{
    constructor({redis,keyPrefix,ttlSeconds}){
        this.redis = redis;
        this.keyPrefix = keyPrefix;
        this.ttlSeconds = ttlSeconds;
    }

    messagesKey(sessionId){
        return `${this.keyPrefix}${sessionId}:messages`;
    }

    async loadMessages(sessionId){
        const raw = await this.redis.get(this.messagesKey(sessionId));
        if(!raw) return [];
        return mapStoredMessagesToChatMessages(JSON.parse(raw));
    }

    async saveMessage(sessionId,messages){
        const payload = JSON.stringify(mapChatMessagesToStoredMessages(messages));
        await this.redis.set(this.messagesKey(sessionId),payload,'EX',this.ttlSeconds);
    }
    //获取过期时间
    async ttl(sessionId){
        return this.redis.ttl(this.messagesKey(sessionId));
    }

}
const model = new ChatOpenAI({
    model:process.env.MODEL_NAME,
    apiKey:process.env.OPENAI_API_KEY,
    configuration:{
        baseURL:process.env.OPENAI_API_BASE_URL,
    },
    temperature:0,
})

async function invokeWithMemory(agent,store,sessionId,userText){
    //加载历史信息
    const history = await store.loadMessages(sessionId);
    const result = await agent.invoke(
        {messages:[...history,new HumanMessage(userText)]},
        {recursionLimit:30}
    );
    console.log(result);
    await store.saveMessage(sessionId,result.messages);
    const ttl = await store.ttl(sessionId);
    console.log('过期时间:',ttl);
    return result;
}

const agent = createAgent({
    model,
    tools:[],
    systemPrompt:"你是会话助手，记住用户提到的事实，中文简短回答，若消息中有对话摘要，请据此对话",
    middleware:[
        summarizationMiddleware({
            model,
            summaryPrompt,
            trigger:{messages:8},
            keep:{messages:4}
        })
    ]
})
const redis = new Redis({
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    db: Number(REDIS_DB),
})
redis.on('connect',()=>console.log('Redis 连接成功'))
redis.on('error',(err)=>console.log('Redis 连接失败',err))

const store = new RedisMessageStore({
    redis,
    keyPrefix: KEY_PREFIX,
    ttlSeconds: MEMORY_TTL,
})

console.log("输入 exit/ quit / :q 退出, :clear 清空记忆\n");
const rl = readline.createInterface({
    input:stdin,
    output:stdout,
})
let prevCount = (await store.loadMessages(SESSION_ID)).length;

try{
    while(true){
        let userText
        try{
            userText = (await rl.question("你：")).trim()
        }catch{
            break   // 输入流结束（EOF），退出循环
        }
        if(!userText) continue;
        if(["exit","quit",":q"].includes(userText.toLowerCase())) break;
        if(userText === ":clear"){
            await store.saveMessage(SESSION_ID,[]);
            prevCount = 0;
            console.log('记忆已清空');
            continue;
        }

        await invokeWithMemory(agent,store,SESSION_ID,userText);

    }
    rl.close();
    await redis.quit();
}catch(err){
    console.log('错误:',err);
}