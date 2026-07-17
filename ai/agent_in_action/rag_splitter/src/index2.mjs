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
    separators:["。","!","?"],
    chunkOverlap:100,
})

const splitDocuments= await textSplitter.splitDocuments(documents);
console.log(splitDocuments);