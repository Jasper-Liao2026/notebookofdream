// memory 管理的三个手段，截断，
import {InMemoryChatMessageHistory} from '@langchain/core/chat_history';
import {HumanMessage,AIMessage} from '@langchain/core/messages';

async function messageCountTruncation(){
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
    //invoke 之前截断
    let allMessages = await history.getMessages();
    const trimmedMessages = allMessages.slice(-maxMessages);
    console.log(`截断后消息数量：${trimmedMessages.length}`);
    console.log(`保留的消息：`,trimmedMessages.map(m => `${m.constructor.name}:${m.content}`).join('\n'));
}
//message token 计算
function countTokens(messages,encoder){
    let total = 0;
    for(const msg of messages){
        const content = typeof msg.content === 'string'?msg.content:JSON.stringify(msg.content);
        total += encoder.encode(content).length;
    }
    return total;
}

async function tokenCountTruncation(){
    const history = new InMemoryChatMessageHistory();
    const maxTokens = 100;//tokens 上限
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
    //invoke 之前截断
    let allMessages = await history.getMessages();
    const enc = getEncoding("cl100k_base");//编码
    // 最近的，content 定制的token 长度计算，截取
    const trimmedMessages = await trimMessages(allMessages,{
        maxTokens:maxTokens,
        // 不同llm token 计算方式不一样
        tokenCounter:async (msgs) => countTokens(msgs,enc),
        strategy:'latest'
    });
}

messageCountTruncation().catch(console.error);