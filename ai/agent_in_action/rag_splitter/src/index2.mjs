import 'dotenv/config'
import "cheerio"
// 从url 加载文档
import {
    //loader 按url 加载
  CheerioWebBaseLoader
} from '@langchain/community/document_loaders/web/cheerio'
import {
    //递归
    RecursiveCharacterTextSplitter
} from '@langchain/textsplitters'

import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import {
  ChatOpenAI,
  OpenAIEmbeddings,
} from '@langchain/openai';

const model = new ChatOpenAI({
  temperature: 0,
  model: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.QENWEN_API_KEY,
  model: process.env.EMBEDDINGS_MODEL_NAME,
  configuration: {
    baseURL: process.env.QENWEN_BASE_URL
  },
});


// 访问网址，提取文档内容
// cheerio 可以传递css 选择器 来提取文档的内容
// 爬取指定内容 + Document标准
const cheerioLoader = new CheerioWebBaseLoader(
  'https://juejin.cn/post/7662627075258449946',
  {
    selector: '.main-area p',
  }
)
//大的document 分成小的document 更加精细的去处理语义
//按段落可进行语义分段理论可行
//如果段落太长或者太短则不行
//可以按句子分（。？！）

// chunk的大小 400字符
const documents = await cheerioLoader.load()// 加载文档
// console.log(documents)
//切片
//语义排第一
//按大小来切割，chunkSize 就够了
//为了语义完整。少一点
//递归 尝试不同的分隔符，找到最优的分割符，使每个chunk 都有语义
//切接近chunkSize
//不完美的地方，直接硬切 chunkOverlap来补救 重叠切割
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize:400,//每个chunk 大小  document，切片chunk
    //递归尝试
    separators:["。","!","?"],
    //文字会被中间切断语义？通篇没有标点 ，菜单 佛经 古文
    //如果切断了，就会用overlap空间来补救 10%
    //如果没有被切断，不会overlap的
    chunkOverlap:100,
})

const splitDocuments= await textSplitter.splitDocuments(documents);
console.log(splitDocuments);
console.log(`文档分割完成，共${splitDocuments.length}个chunks`);
console.log("创建向量数据库");



const vectorStores = await MemoryVectorStore.fromDocuments(
  splitDocuments,
  embeddings
);
console.log("向量存储完成");
const retriever = vectorStores.asRetriever({ k: 3 })
const question = "fs模块有哪些api"

// 检索相关文档
const docs = await retriever.invoke(question)

// 拼上下文
const context = docs
  .map((doc, i) => `[片段${i + 1}]\n${doc.pageContent}`)
  .join('\n\n---\n\n')

// Augmented
const prompt = `你是一个文章辅助阅读助手，根据文章内容来解答
文章内容：
${context}
问题：
${question}`;

const answer = await model.invoke(prompt)
console.log(answer.content)

