import 'dotenv/config';
import {ChatOpenAI} from '@langchain/openai';
import {
    InMemoryChatMessageHistory
}from '@langchain/core/chat_history';
import {
    HumanMessage,SystemMessage
}from '@langchain/core/messages';

const model = new ChatOpenAI({
    modelName:process.env.MODEL_NAME,
    apiKey:process.env.OPENAI_API_KEY,
    temperature:0,
    configuration:{
        baseURL:process.env.OPENAI_API_BASE_URL,
    }
})

async function inMemoryDemo(){
    //数组 升华到 内存级的实例
    const history = new InMemoryChatMessageHistory();
    // console.log(history)
    const systemMessage = new SystemMessage("现在开始你的身份是一个友好，幽默的做菜助手，喜欢分享美食和烹饪技巧。");
    console.log('第一轮')
    const userMessage1 = new HumanMessage("你今天吃什么？");
    await history.addMessage(userMessage1);//增加用户消息到历史记录
    const messages1 = [systemMessage,...(await history.getMessages())];
    // console.log(messages1);
    const response1 = await model.invoke(messages1);
    console.log(`助手：${response1.content}\n`);
    //维护memory
    await history.addMessage(response1);
    // console.log(await history.getMessages());
    console.log('第二轮');
    const userMessage2 = new HumanMessage("推荐一份美食？");
    const message2 = [systemMessage,...(await history.getMessages())];
    const response2 = await model.invoke(message2);
    await history.addMessage(response2);
    console.log(`助手：${response2.content}\n`);


    const allMessages = await history.getMessages();
    console.log(`一共${allMessages.length}条`);
    allMessages.forEach((msg,index)=>{
        const type = msg.type;
        const prefix = type === 'human' ? '用户' : '助手';
        console.log(`${index+1}.[${prefix}]:${msg.content.substring(0,50)}...`);
    })

}
//异步函数执行完之后返回Promise<T>
inMemoryDemo()
    //链式调用chain
    .catch(console.error)
    .finally(()=>{
        console.log('done')
    })