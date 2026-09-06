import 'dotenv/config';
import path from 'node:path';
import {ChatOpenAI} from '@langchain/openai';
import {
    FileSystemChatMessageHistory
}from '@langchain/community/stores/message/file_system';
import {
    HumanMessage,SystemMessage,AIMessage
}from '@langchain/core/messages';
const model = new ChatOpenAI({
    modelName:process.env.MODEL_NAME,
    apiKey:process.env.OPENAI_API_KEY,
    temperature:0,
    configuration:{
        baseURL:process.env.OPENAI_API_BASE_URL,
    }
})

async function fileHistoryDemo(){
    const filePath = path.join(process.cwd(),"chat_history.json");
    const sessionId = "user_session_001";//多用户
    const history = new FileSystemChatMessageHistory({
        filePath,
        sessionId,
    });
    const systemMsg = new SystemMessage("现在开始你的身份是一个友好，幽默的做菜助手，喜欢分享美食和烹饪技巧。");
    console.log('第一轮')
    const userMessage1 = new HumanMessage("红烧肉怎么做");
    await history.addMessage(userMessage1);
    const messages1 = [systemMsg,...(await history.getMessages())];
    const response1 = await model.invoke(messages1);
    await history.addMessage(response1); // 添加 AI 回复到历史
    console.log(`用户：${userMessage1.content}\n`);
    console.log(`助手：${response1.content}\n`);
    
    console.log('第二轮');
    const userMessage2 = new HumanMessage("好吃吗？");
    await history.addMessage(userMessage2); // 添加用户消息到历史
    const messages2 = [systemMsg,...(await history.getMessages())];
    const response2 = await model.invoke(messages2);
    await history.addMessage(response2); // 添加 AI 回复到历史
    console.log(`用户：${userMessage2.content}\n`);
    console.log(`助手：${response2.content}\n`);
}

fileHistoryDemo()
    .catch(console.error)