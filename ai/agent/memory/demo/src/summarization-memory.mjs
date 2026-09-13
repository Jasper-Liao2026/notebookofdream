import 'dotenv/config';
// 被截断的数组->字符串拼接 -> ai summarization 
import {InMemoryChatMessageHistory} from '@langchain/core/chat_history';
import {HumanMessage,AIMessage,trimMessages,getBufferString} from '@langchain/core/messages';
import {ChatOpenAI} from '@langchain/openai';
const model = new ChatOpenAI({
    modelName:process.env.MODEL_NAME,
    apiKey:process.env.OPENAI_API_KEY,
    temperature:0,
    configuration:{
        baseURL:process.env.OPENAI_API_BASE_URL,
    }
})

async function summarizeHistory(messages){
    if(messages.length ===0) return "";
    //对象数组->字符串
    const conversationText = getBufferString(messages,'用户','助手');
    // console.log(conversationText);
    const summaryPrompt = `请总结以下对话的核心内容，保留重要信息：${conversationText}
    总结：
    `;

    //langchain 编排线性工作流 pipe
    //langgraph 非线性工作流 graph
    const summaryResponse = await model.invoke([new SystemMessage(summaryPrompt)]);
    return summaryResponse.content;
}
async function summarizationMemoryDemo(){
    const history = new InMemoryChatMessageHistory();
    const maxMessages = 4;
        const messages = [
        {type:'ai',content:'你好，我是AI助手'},
        {type:'human',content:'你好，我是用户'},
        {type:'ai',content:'你今天吃什么？'},
        {type:'human',content:'推荐一份美食？'},
        {type:'ai',content:'我推荐红烧肉'},
        {type:'human',content:'好吃吗？'},
    ];
    for(const msg of messages){
        if(msg.type === 'human'){
            await history.addMessage(new HumanMessage(msg.content));
        }else {
            await history.addMessage(new AIMessage(msg.content));
        }
    }

    let allMessages = await history.getMessages();
    console.log(`原始消息数量：${allMessages.length}`);
    console.log(`原始消息：`,allMessages.map(m => `${m.constructor.name}:${m.content}`).join('\n'));
    if(allMessages.length>maxMessages){
        const keepRecent = 2;
        const recentMessages = allMessages.slice(-keepRecent);
        const messagesToSummarize = allMessages.slice(0,keepRecent);
        console.log("\n历史消息过多，开始总结...");
        console.log(`\n将被总结的消息数量：${messagesToSummarize.length}`);

        const summary = await summarizeHistory(messagesToSummarize);
        await history.clear();
        
        for(const msg of recentMessages){
            await history.addMessage(msg);
        }

        await history.addMessage(new AIMessage(summary));

        const newMessages = await history.getMessages();

        for(let mes of newMessages){
            console.log(mes.constructor.name,mes.content);
        }
    }
}

summarizationMemoryDemo().catch(console.error);