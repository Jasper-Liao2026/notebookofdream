import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

import {
    OpenAIEmbeddings,
    ChatOpenAI,
}from '@langchain/openai';
import {
    MilvusClient,
    DataType,
    MetricType,
    IndexType
} from '@zilliz/milvus2-sdk-node'
import {
    HumanMessage,
    SystemMessage
} from '@langchain/core/messages';

const COLLECTION_NAME = 'conversations';//集合
const VECTOR_DIM = 1024;//维度

const embedding = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-v3',
    configuration:{
        baseURL: process.env.OPENAI_BASE_URL,
    },
    dimension:VECTOR_DIM,
});
async function getEmbedding(text){
    const result = await embedding.embedQuery(text);
    return result;
}

const client = new MilvusClient({
    address:'localhost:19530',
})

const model = new ChatOpenAI({
    modelName:process.env.CHAT_MODEL_NAME,
    apiKey:process.env.OPENAI_API_KEY,
    temperature:0,
    configuration:{
        baseURL:process.env.OPENAI_BASE_URL,
    }
})

async function retrieveRelevantConversations(query,topK=2){
    try{
        const queryVector = await getEmbedding(query);
        const searchResult = await client.search({
            collection_name:COLLECTION_NAME,
            vector:queryVector,
            limit:topK,
            metric_type:MetricType.COSINE,
            output_files:['id','content','round','timestamp']
        });
        return searchResult.results;
    }catch(err){
        console.error('检索时出现错误:',err.message);
        return [];
    }
}
async function retrievalMemoryDemo(){
    try{
        console.log('链接到Milvus...');
        await client.connectPromise;
        console.log('已连接\n');
    }catch(err){
        console.error('链接到Milvus失败:',err);
        return;
    }
    const conversations = [
    {input:"我之前提到的机器学习项目进展如何"},
    {input:"我周末经常做什么"},
    {input:"我的职业是什么？"}
]

for(let i= 0;i<conversations.length;i++){
    const {input} = conversations[i];
    const userMessage = new HumanMessage(input);

    console.log(`\n 第${i+1}轮: ${input}`);
    console.log(`\n [检索相关历史对话]`);
    const retrievedConversations = await retrieveRelevantConversations(input,2);
    let relevantHistory = '';

    if(retrievedConversations.length > 0){
        relevantHistory = retrievedConversations.map((conv,idx)=>{
            return `[历史对话${idx + 1}]
            轮次:${conv.round}
            ${conv.content}
            `
        }).join('\n');
    }else{
        console.log('没有找到相关历史对话');
    }
    
    //milvus检索历史对话

    console.log(relevantHistory,'-------------');
    const contextMessage = new relevantHistory ? [new HumanMessage(`相关历史对话:\n${relevantHistory}`)] : [];
    const response = await model.invoke(contextMessage);
    console.log(response.content);
    await history.addMessages(userMessage);
    await history.addMessages(response);
    //会话 持久化到milvus
    const conversationText = `用户：${input}\n助手：${response.content}`;
    const convId = `conv_${Date.now()}_${i+1}`; //时间 + i 生成唯一id
    const convVector = await getEmbedding(conversationText);
    try{
        await client.insert({
            collection_name:COLLECTION_NAME,
            data:[{
                id:convId,
                content:conversationText,
                vector:convVector, 
                round:i+1,
                timestamp:new Date().toISOString()
            }]
        })
    }catch(err){

    }
}
}


retrievalMemoryDemo().catch(console.error);