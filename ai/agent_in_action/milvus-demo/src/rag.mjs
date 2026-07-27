import 'dotenv/config';
import{
    MilvusClient,
    MetricType  ,  //相似度求方法
    IndexType,
    DataType  //字段数据类型约束
} from '@zilliz/milvus2-sdk-node';
import{
    ChatOpenAI,
    OpenAIEmbeddings
} from '@langchain/openai';

const ADDRESS = process.env.MILVUS_ADDRESS;
const TOKEN = process.env.MILVUS_TOKEN;
const COLLECTION_NAME = 'ai_dairy';
const VECTOR_DIM = 1024;

const model = new ChatOpenAI({
    temperature:0.1,
    model:process.env.CHAT_MODEL_NAME,
    apiKey:process.env.OPENAI_API_KEY,
    configuration:{
        baseURL:process.env.OPENAI_BASE_URL
    }
})
const embedding = new OpenAIEmbeddings({
 apiKey: process.env.OPENAI_API_KEY,
 model: process.env.EMBEDDING_MODEL_NAME,
 configuration: {
  baseURL: process.env.OPENAI_BASE_URL,
 },
 dimensions: VECTOR_DIM,
})
const client =new MilvusClient({
    address :ADDRESS ,
    token : TOKEN
})

const getEmbedding = async (text) => {
    const result = await embedding.embedQuery(text);
    return result;
}

async function retrieveRelevantDiaries(question,k=2){
    try{
        const queryVector = await getEmbedding(question);
        const searchResult = await client.search({
            collection_name:COLLECTION_NAME,
            vector:queryVector,
            limit:k,
            metric_type:MetricType.COSINE,
            output_fields:['id','content','date','mood','tags'],
        });
        return searchResult.results;
    }catch(err){
        console.log('检索日记时出错',err.message);
        return [];
    }
}

async function answerDiaryQuestion(question,k=2){
    try{
        console.log('='.repeat(80));
        console.log(`问题：${question}`);
        console.log('='.repeat(80));

        console.log('检索相关日记');
        const retrievedDiaries = await retrieveRelevantDiaries(question,k);
        if(retrievedDiaries.length===0){
            console.log('未找到相关日记');
            return ;
        }

        retrievedDiaries.forEach((diary,i)=>{
            console.log(`日记${i+1} 相识度:${diary.score.toFixed(4)}\n
            内容:${diary.content}
            `)
        })

        const context = retrievedDiaries.map((diary,i)=>`
        [日记${i+1}]
        日期:${diary.date}
        心情:${diary.mood}
        标签:${diary.tags?.join(',')}
        内容:${diary.content}
        `).join('\n\n----\n\n')

        const prompt = `你是一个温暖贴心的ai日记助手，基于用户的日记内容回答问题，用亲切自然的语言，请根据以下日记内容回答问题:${context}
        用户问题:${question}
        回答要求:
        1.如果日记中有相关信息，请结合日记内容给出详细、温暖的回答。
        2.可以总结多篇日记的内容，找出共同点或趋势。
        3.如果日记中没有相关信息，请温和告知用户。
        4.用第一人称"你" 来称呼日记的作者。
        5.回答要有同理心，让用户感到被理解和关心。
        `;
        console.log('[ai回答]');
        const response = await model.invoke(prompt);
        console.log(response.content);
    }catch(err){
        console.log(err.message);
    }
}

async function main(){
    try{
        console.log('链接到Milvus');
        await client.connectPromise;//先握手
        console.log('已连接');
        await answerDiaryQuestion('我最近做了什么让我感到快乐的事',2);
    }catch(err){
        console.error(err);
    }
}

main();