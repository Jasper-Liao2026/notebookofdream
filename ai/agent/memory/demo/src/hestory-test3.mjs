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
//从文件中恢复history
async function fileHistoryDemo(){
    const filePath = path.join(process.cwd(),"chat_history.json");
    const sessionId = "user_session_001";
    const systemMsg = new SystemMessage("现在开始你的身份是一个友好，幽默的做菜助手，喜欢分享美食和烹饪技巧。");
    const restoredHistory = new FileSystemChatMessageHistory({
        filePath,
        sessionId,
    })
    const restoredMessages = await restoredHistory.getMessages();
    console.log(`从文件中恢复了${restoredMessages.length}条历史消息`);
    restoredMessages.forEach((msg,index)=>{
        const type = msg.type;
        const prefix = type === 'human' ? '用户' : '助手';
        console.log(`${index+1}.[${prefix}]:${msg.content.substring(0,50)}...`);
    })
    console.log('第三轮对话');
    const userMessage3 = new HumanMessage("需要哪些食材？");
    await restoredHistory.addMessage(userMessage3);
    const messages3 = [systemMsg,...(await restoredHistory.getMessages())];
    const response3 = await model.invoke(messages3);
    await restoredHistory.addMessage(response3);
    console.log(response3.content);
    console.log('对话已经保存在文件');
}  

fileHistoryDemo().catch(console.error);