import 'dotenv/config'
import {
  MilvusClient, // c|s  B|C 架构
  MetricType , // 相似度求方法
} from '@zilliz/milvus2-sdk-node'
import {
  OpenAIEmbeddings,
} from '@langchain/openai'

const ADDRESS =process.env.MILVUS_ADDRESS
const TOKEN=process.env.MILVUS_TOKEN
const COLLECTION_NAME = 'ebook';
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
    console.log('Connecting to Milvus');
    await client.connectPromise;
    console.log('connected\n');
    await client.loadCollection({
      collection_name:COLLECTION_NAME,
    })
    const query = '段誉会什么武功？';
    console.log(`QUERY: ${query}\n`);
    const queryVector = await getEmbedding(query);
    const searchResult = await client.search({
      collection_name:COLLECTION_NAME,
      vector:queryVector,
      limit:3,
      metric_type:MetricType.COSINE,
      output_fields:["id","book_id","chapter_num","index","content"]
    });
    console.log(`Found ${searchResult.results.length} results:\n`);
    searchResult.results.forEach((item,index)=>{
      console.log(`${index + 1}.[Score:${item.score.toFixed(4)}]`);
      console.log(`  ID:${item.id}`);
      console.log(`  BookId:${item.book_id}`);
      console.log(`  Chapter:${item.chapter_num}`);
      console.log(`  Content:${item.content}\n`);
    })
  }catch(err){
    console.error('查询出错:', err.message);
  }
}

main().catch(err=>{
  console.log(err);
})