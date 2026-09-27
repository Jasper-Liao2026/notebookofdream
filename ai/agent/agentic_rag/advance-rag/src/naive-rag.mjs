import "dotenv/config";
import {
    ChatOpenAI,
    OpenAIEmbeddings
} from "@langchain/openai";
import {
    Annotation,
    END,
    START,
    StateGraph
} from "@langgraph/langgraph";
import {Milvus} from '@langchain/community/vectorstores/milvus'
const COLLECTTION_NAME= 'ebook_collection';
const TOP_K = 5;
const GraphState = Annotation.Root({
    question:Annotation,//问题
    k:Annotation,//检索数量
    document:Annotation,//检索到的文档
    generation:Annotation,//生成的答案
})

const model = new ChatOpenAI({
    model:process.env.MODEL_NAME,
    temperature:0,
    configuration: {
        baseURL: process.env.OPENAI_API_BASE_URL,
    }   ,
    apiKey:process.env.OPENAI_API_KEY,
})
const embeddings = new OpenAIEmbeddings({
    model:'text-embedding-v3',
    dimensions:1024
})


let vectorStore;

async function retrieveRelevantDocuments(question,k=TOP_K){
    try{
        const docsWithScores = await vectorStore.similaritySearchWithScore(question,k);
        return docsWithScores.map(([doc, score]) =>({
            score,
            content:doc.pageContent,
            id:doc.metadata.id??"unknown",
            book_id:doc.metadata?.book_id??"未知",
            chapter_num:doc.metadata?.chapter_num??"未知",
            index:doc.metadata?.index??"未知",
        }))
    }catch(err){
        console.error(err);
        return [];
    }
}
const retrieveNode = async(state)=>{
    const documents = await retrieveRelevantDocuments(state.question,state.k)
    return {
        question:state.question,
        k:state.k,
        documents
    }
}

const generateNode = async(state)=>{
    const context = state.documents.map((item,i)=>`[片段${i+1}]
    章节：第${item.chapter_num}章，索引：${item.index}
    内容：
    ${item.content}
    `).join("\n")
    const prompt = `你是一个专业的天龙八部小说助手，基于小说内容回答问题，用准确，详细的语言。
    请根据以下天龙八部小说片段内容回答问题：${context}
    用户的问题是：${state.question}
    回答要求:
    1. 回答必须基于小说内容，不能超出小说范围。
    2. 回答必须用中文。
    回答要求:AI助手的回答:

    `
    process.stdout.write("\n[AI回答(流式)]\n")
    let generation = "";
    const stream = model.stream(prompt);
    for await (const chunk of stream) {
        const text = typeof chunk.content === 'string' ? chunk.content : chunk.content.join('');
        if(!text) continue;
        generation += text;
        process.stdout.write(text);
    }
    return {
        question:state.question,
        k:state.k,
        documents:state.documents,
        generation,
    }
}
const graph = new StateGraph(GraphState)
    .addNode("retrieve",retrieveNode)
    .addNode("generate",generateNode)
    .addEdge(START,"retrieve")
    .addEdge("retrieve","generate")
    .addEdge("generate",END)
    .compile();

 const drawable = await   graph.getGraphAsync();
 const mermaid = drawable.drawMermaid({withStyle:true});
 console.log(mermaid);

 async function main(){
    const question = "阿朱的结局是什么"
    const kArg = 5;
    console.log("链接到milvus...")
    vectorStore = await Milvus.fromExistingCollection(embeddings,{
        collectionName:COLLECTTION_NAME,
        url:"localhost:19530",
        textField:"content",
        primaryField:"id",
        vectorField:"vector",
        indexCreateOptions:{
            metric_type:"cosine",
            index_type:"HNSW",
            param:{M:16,efConstruction:}
        }
    })
 }
 main().catch(err=>console.error(err));