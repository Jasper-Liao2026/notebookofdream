import 'dotenv/config'
import {
  MilvusClient, // c|s  B|C 架构
  IndexType,
  MetricType , // 相似度求方法
  DataType, // 字段数据类型约束
} from '@zilliz/milvus2-sdk-node'
import {
  OpenAIEmbeddings,
} from '@langchain/openai'

const ADDRESS =process.env.MILVUS_ADDRESS
const TOKEN=process.env.MILVUS_TOKEN
const COLLECTION_NAME = 'ai_dairy';
const VECTOR_DIM=1024; 

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

async function main(){
  try{
    console.log("Connection to Milvus...")
    await client.connectPromise; //链接milvus
    console.log("Connected successfully");
    const query = '我想看看关于户外活动的日记';
    console.log(`QUERY:${query}`);
    const queryVector = await getEmbedding(query);
    const searchResult = await client.search({
        collection_name:COLLECTION_NAME,
        vector:queryVector,
        limit:2,
        metric_type:MetricType.COSINE,
        output_fields:['id','content','data','mood','tags']
    });
    console.log(`Found${searchResult.results.length} results`);
    searchResult.results.forEach((item,index)=>{
        console.log(`${index+1},[Score:${item.score.toFixed(4)}]`);
        console.log(`
            ID:${item.id};
            Date:${item.date};
            Mood:${item.mood};
            Tags:${item.tags?.join(",")};
            Content:${item.content};
            `)
    })
  }catch(err){
    console.error(err)
  }
}

main().catch(console.error)