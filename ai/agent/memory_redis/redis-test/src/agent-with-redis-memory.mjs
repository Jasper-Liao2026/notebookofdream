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

// 摘要提示词：消息超过阈值时，中间件用它把旧对话压缩成一段文本（{message} 为占位符）
const summaryPrompt = `你是对话摘要助手，请用中文总结以下对话，包含：
1.讨论的主要话题
2.用户提到的重要事实(姓名、偏好、日期等，务必保留原文信息)
3.继续对话所需的关键上下文
保持简洁、不要编造，不要遗漏用户明确说过的信息
待摘要的对话：
{message}

摘要：
`

// 会话记忆仓储：只管“把消息列表读写到 Redis”，不掺业务逻辑
class RedisMessageStore{
    // 注入依赖：Redis 客户端、key 前缀、过期秒数
    constructor({redis,keyPrefix,ttlSeconds}){
        this.redis = redis;
        this.keyPrefix = keyPrefix;
        this.ttlSeconds = ttlSeconds;
    }

    // 拼出本会话在 Redis 里的完整 key：前缀 + 会话id + :messages
    messagesKey(sessionId){
        return `${this.keyPrefix}${sessionId}:messages`;
    }

    // 读历史：GET → JSON 解析 → 还原成消息对象；key 不存在时返回空数组
    async loadMessages(sessionId){
        const raw = await this.redis.get(this.messagesKey(sessionId));
        if(!raw) return [];
        return mapStoredMessagesToChatMessages(JSON.parse(raw));
    }

    // 写历史：消息对象转成纯数据 → JSON 序列化 → SET 并带上过期时间（每轮都会续期）
    async saveMessage(sessionId,messages){
        const payload = JSON.stringify(mapChatMessagesToStoredMessages(messages));
        await this.redis.set(this.messagesKey(sessionId),payload,'EX',this.ttlSeconds);
    }
    // 查剩余有效期（秒）：-1 表示没设过期，-2 表示 key 已不存在
    async ttl(sessionId){
        return this.redis.ttl(this.messagesKey(sessionId));
    }

}
// 模型实例：OpenAI 兼容协议，通过 baseURL 指向 DeepSeek
const model = new ChatOpenAI({
    model:process.env.MODEL_NAME,
    apiKey:process.env.OPENAI_API_KEY,
    configuration:{
        baseURL:process.env.OPENAI_API_BASE_URL,
    },
    temperature:0,
})

// 一轮对话的核心闭环：取历史 → 调 agent → 存回最新历史 → 打印剩余 TTL
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

// Agent 实例：模型 + 系统提示 + 自动摘要中间件（消息攒到 8 条就压缩，只留最近 4 条原文）
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
// Redis 连接实例：整程序共用一条连接，交给 store 复用
const redis = new Redis({
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    db: Number(REDIS_DB),
})
redis.on('connect',()=>console.log('Redis 连接成功'))
redis.on('error',(err)=>console.log('Redis 连接失败',err))

// 仓储实例：把上面的连接、key 前缀、TTL 组装成可读写的 store
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

// 主循环：每次读一行输入，命中命令就处理，否则调用模型
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