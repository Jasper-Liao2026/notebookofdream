import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });
import {
    MilvusClient,
    DataType,
    MetricType,
    IndexType
} from '@zilliz/milvus2-sdk-node'
import {OpenAIEmbeddings} from '@langchain/openai';
//SQL关系型，NO SQL 非关系型数据库
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

async function main(){
    try{
        console.log('链接到Milvus...');
        await client.connectPromise;
        console.log('链接到Milvus成功');

        console.log('创建集合...');
        await client.createCollection({
            collection_name:COLLECTION_NAME,
            fields:[
                //uuid 唯一的id ，更安全
                {name:"id",data_type:DataType.VarChar,max_length:50,is_primary_key:true},
                {name:'vector',data_type:DataType.FloatVector,dim:VECTOR_DIM},
                {name:'content',data_type:DataType.VarChar,max_length:5000},
                {name:'round',data_type:DataType.Int64},
                //没有时间戳，使用当前时间戳
                {name:'timestamp',data_type:DataType.VarChar,max_length:100},

            ]
        })

        await client.createIndex({
            collection_name:COLLECTION_NAME,
            field_name:'vector',
            index_type:IndexType.IVF_FLAT,
            metric_type:MetricType.COSINE,});
        console.log('创建索引成功');

        await client.loadCollection({collection_name:COLLECTION_NAME});
        const conversations = [
  {
    id: 'conv_001',
    content: '用户：我叫赵六，是一名数据科学家\n助手：很高兴认识你，赵六！数据科学是一个很有趣的领域。',
    round: 1,
    timestamp: new Date().toISOString()
  },
  {
    id: 'conv_002',
    content: '用户：我最近在研究机器学习算法\n助手：机器学习确实很有意思，你在研究哪些算法呢？',
    round: 2,
    timestamp: new Date().toISOString()
  },
  {
    id: 'conv_003',
    content: '用户：我喜欢打篮球和看电影\n助手：运动和文化娱乐都是很好的爱好！',
    round: 3,
    timestamp: new Date().toISOString()
  },
  {
    id: 'conv_004',
    content: '用户：我周末经常去电影院\n助手：看电影是很好的放松方式。',
    round: 4,
    timestamp: new Date().toISOString()
  },
  {
    id: 'conv_005',
    content: '用户：我的职业是软件工程师\n助手：软件工程师是个很有前景的职业！',
    round: 5,
    timestamp: new Date().toISOString()
  }
];
        const conversationData = await Promise.all(
            conversations.map(async(conv)=>({
                ...conv,
                vector:await getEmbedding(conv.content)
            }))
        );
        const insertResult = await client.insert({
            collection_name:COLLECTION_NAME,
            data:conversationData,
        })
        
    }catch(err){
        console.error('链接到Milvus失败:',err);
        return;
    }

}

main().catch(console.error);