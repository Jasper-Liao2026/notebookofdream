import"dotenv/config";
import {parse} from 'path';//path 解析路径
import{
    MilvusClient,
    DataType,
    MetricType,
    IndexType
}from '@zilliz/milvus2-sdk-node'

import{
    OpenAIEmbeddings
}from '@langchain/openai';

import {
    EPubLoader
} from '@langchain/community/document_loaders/fs/epub';

import{
    RecursiveCharacterTextSplitter
} from '@langchain/textsplitters';

const COLLECTION_NAME='ebook';  //编程习惯
const VECTOR_DIM = 1024;
const CHUNK_SIZE = 500;
const EPUB_FILE = './天龙八部.epub';
const ADDRESS = process.env.MILVUS_ADDRESS;
const TOKEN = process.env.MILVUS_TOKEN;
const {name:BOOK_NAME}= parse(EPUB_FILE);

//初始化embeddings模型
const embeddings = new OpenAIEmbeddings({
    apiKey:process.env.OPENAI_API_KEY,
    model:process.env.EMBEDDINGS_MODEL_NAME,
    configuration:{
        baseURL:process.env.OPENAI_BASE_URL,
    },
    dimensions:VECTOR_DIM
});

//向量数据库的初始化
const client = new MilvusClient({
    address:ADDRESS,
    token:TOKEN,
})
async function getEmbedding(text){
    const result = await embeddings.embedQuery(text);
    return result;
}
async function ensureCollection(bookId){
    //没有就建立
    //有就忽略
    try{
        //判断是否已经创建
        const hasCollection = await client.hasCollection({
            collection_name:COLLECTION_NAME
        });
        console.log(hasCollection.value);
        if(!hasCollection.value){
            console.log('创建集合...');
            await client.createCollection({
                collection_name:COLLECTION_NAME,
                fields:[
                    {name:'id',data_type:DataType.VarChar,max_length:100,is_primary_key:true},
                    {name:'book_id',data_type:DataType.VarChar,max_length:100},
                    {
                        name:'book_name',data_type:DataType.VarChar,
                        max_length:200
                    },
                    {//第几章的
                        name:'chapter_num',data_type:DataType.Int32,
                    },
                    //第几个数据切片
                    {
                        name:'index',
                        data_type:DataType.Int32
                    },
                    {
                        name:'content',data_type:DataType.VarChar,max_length:10000
                    },
                    {
                        name:'vector',data_type:DataType.FloatVector,dim:VECTOR_DIM
                    }
                ]
            })
            console.log('集合创建成功');
            console.log('创建索引');
            await client.createIndex({
                collection_name:COLLECTION_NAME,
                field_name:'vector',
                // nlist 是K-Means 聚类的簇数
                index_type:IndexType.IVF_FLAT,
                metric_type:MetricType.COSINE,
                params:{nlist:1024},
            })

            // consin 高维相识度，不慢，数据量大了
            console.log('索引创建成功');

        }
        //细节捕捉错误
        //每次要做的
        try{
            await client.loadCollection({collection_name:COLLECTION_NAME});
            console.log('集合加载成功');
        }catch(err){
            console.error('集合已经处于加载状态');
        }
    }catch(err){
        console.error('创建集合时出错', err);
    }
}

async function loadAndProcessEPubStreaming(bookId){
    try{

        console.log(`\n 开始加载EPUB文件：${EPUB_FILE}`);
        const loader = new EPubLoader(EPUB_FILE,{
            //加载后就会按章节生成多个document
            //内存需求的必然
            splitChapters:true
        });
        const documents = await loader.load();
        console.log(`加载完成，共${documents.length}个章节`);

        const textSplitters = new RecursiveCharacterTextSplitter({
            //没传separtor就用默认的\n
            chunkSize:CHUNK_SIZE,
            chunkOverlap:50,
        })
        let totalInserted = 0;// 计数
        let documentLen =document.length;
        for(let chapterIndex = 0;chapterIndex<document.length;chapterIndex++){

        }
    }catch(err){
        console.error('加载EPUB时出错', err);
    }
}

const main =async()=>{
    try{
        console.log('='.repeat(80));
        console.log('电子书处理程序')
        console.log('='.repeat(80));
        console.log('链接到Milvus...');
        await client.connectPromise;
        console.log('已连接');
        const bookId = 1;
        //确保集合建立了
        await ensureCollection(bookId);
        //加载和处理epub文件
        //一边切割一边embedding,一边存数据库
        await loadAndProcessEPubStreaming(bookId);
    }catch(err){
        console.error('主程序出错', err);
    }
}
main();