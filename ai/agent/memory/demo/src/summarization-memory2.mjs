import {InMemoryChatMessageHistory} from '@langchain/core/chat_history';
import {HumanMessage,AIMessage,trimMessages,SystemMessage} from '@langchain/core/messages';
import {ChatOpenAI} from '@langchain/openai';
import {getEncoding} from 'js-tiktoken';
const model = new ChatOpenAI({
    modelName:process.env.MODEL_NAME,
    apiKey:process.env.OPENAI_API_KEY,
    temperature:0,
    configuration:{
        baseURL:process.env.OPENAI_API_BASE_URL,
    }
})
function countTokens(messages,encoder){
    let total = 0;
    for(const msg of messages){
        const content = typeof msg.content === 'string'?msg.content:JSON.stringify(msg.content);
        total += encoder.encode(content).length;
    }
    return total;
}

async function summarizationMemoryDemo(){
    const history = new InMemoryChatMessageHistory();
    const encoder = getEncoding('cl100k_base');
    //超过maxTokens 时触发总结
    const maxTokens = 200;
    //保留最近消息的token 数量
    const keepRecentTokens = 80;
    const messages = [];

    for(const msg of messages){
        if(msg.type === 'human'){
            await history.addMessage(new HumanMessage(msg.content));
        }else{
            await history.addMessage(new AIMessage(msg.content));
        }
    }
    let allMessages = await history.getMessages();
    const totalTokens = countTokens(allMessages,encoder);
    console.log(totalTokens);
    if(totalTokens >= maxTokens){
        const recentMessages=[];
        let recentTokens = 0;
        for(let i=allMessages.length-1;i>=0;i--){
            const msg = allMessages[i];
            const content = typeof msg.content === 'string'?msg.content:JSON.stringify(msg.content);
            const msgTokens = encoder.encode(content).length;
            if(recentTokens + msgTokens <= keepRecentTokens){
                recentMessages.unshift(msg);
                recentTokens += msgTokens;
            }else{
                break;
            }
        }
        const messagesToSummarize = allMessages.slice(0,allMessages.length-recentMessages.length);
        const summary = await summarizeHistory(messagesToSummarize);
        await history.clear();
        for(const msg of recentMessages){
            await history.addMessage(msg);
        }
        await history.addMessage(new AIMessage(summary));
    }
}

summarizationMemoryDemo().catch(console.error);