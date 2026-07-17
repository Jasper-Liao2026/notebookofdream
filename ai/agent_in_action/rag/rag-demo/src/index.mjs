import 'dotenv/config'
import {
  ChatOpenAI,
  OpenAIEmbeddings
} from '@langchain/openai'
// 内存向量存储  rag 学习或轻量
// psql
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory'
import { Document } from '@langchain/core/documents'

const model = new ChatOpenAI(
  {
    temperature: 0,
    model: 'deepseek-v4-pro',
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
      baseURL: process.env.DEEPSEEK_BASE_URL,
    }
  }
)

const embedding = new OpenAIEmbeddings(
  {
    apiKey: process.env.QENWEN_API_KEY,
    model: 'text-embedding-v4',
    configuration: {
      baseURL: process.env.QENWEN_BASE_URL,
    }
  }   
)

const documents = [
  new Document({
    pageContent: `光光是一个活泼开朗的小男孩，他有一双明亮的大眼睛，总是带着灿烂的笑容。光光最喜欢的事情就是和朋友们一起玩耍，他特别擅长踢足球，每次在球场上奔跑时，就像一道阳光一样充满活力。`,
    // metadata 用于后续过滤或溯源，不参与向量化计算，但非常有用
    metadata: { 
      chapter: 1, 
      character: "光光", 
      type: "角色介绍", 
      mood: "活泼"
    },
  }),
  new Document({
    pageContent: `东东是光光最好的朋友，他是一个安静而聪明的男孩。东东喜欢读书和画画，他的画总是充满了想象力。虽然性格不同，但东东和光光从幼儿园就认识了，他们一起度过了无数个快乐的时光。`,
    metadata: { 
      chapter: 2, 
      character: "东东", 
      type: "角色介绍", 
      mood: "温馨"
    },
  }),
  new Document({
    pageContent: `有一天，学校要举办一场足球比赛，光光非常兴奋，他邀请东东一起参加。但是东东从来没有踢过足球，他担心自己会拖累光光。光光看出了东东的担忧，他拍着东东的肩膀说："没关系，我们一起练习，我相信你一定能行的！"`,
    metadata: {
      chapter: 3,
      character: "光光和东东",
      type: "友情情节",
      mood: "鼓励",
    },
  }),
  new Document({
    pageContent: `接下来的日子里，光光每天放学后都会教东东踢足球。光光耐心地教东东如何控球、传球和射门，而东东虽然一开始总是踢不好，但他从不放弃。东东也用自己的方式回报光光，他画了一幅画送给光光，画上是两个小男孩在球场上一起踢球的场景。`,
    metadata: {
      chapter: 4,
      character: "光光和东东",
      type: "友情情节",
      mood: "互助",
    },
  }),
  new Document({
    pageContent: `比赛那天终于到了，光光和东东一起站在球场上。虽然东东的技术还不够熟练，但他非常努力，而且他用自己的观察力帮助光光找到了对手的弱点。在关键时刻，东东传出了一个漂亮的球，光光接球后射门得分！他们赢得了比赛，更重要的是，他们的友谊变得更加深厚了。`,
    metadata: {
      chapter: 5,
      character: "光光和东东",
      type: "高潮转折",
      mood: "激动",
    },
  }),
  new Document({
    pageContent: `从那以后，光光和东东成为了学校里最要好的朋友。光光教东东运动，东东教光光画画，他们互相学习，共同成长。每当有人问起他们的友谊，他们总是笑着说："真正的朋友就是互相帮助，一起变得更好的人！"`,
    metadata: {
      chapter: 6,
      character: "光光和东东",
      type: "结局",
      mood: "欢乐",
    },
  }),
  new Document({
    pageContent: `多年后，光光成为了一名职业足球运动员，而东东成为了一名优秀的插画师。虽然他们走上了不同的道路，但他们的友谊从未改变。东东为光光设计了球衣上的图案，光光在每场比赛后都会给东东打电话分享喜悦。他们证明了，真正的友情可以跨越时间和距离，永远闪闪发光。`,
    metadata: {
      chapter: 7,
      character: "光光和东东",
      type: "尾声",
      mood: "温馨",
    },
  }),
]
// 把一堆的documents 用embeddings 模型向量化，存入内存中
//可以拥有一个语义搜索的知识库

const vectorStore = await MemoryVectorStore.fromDocuments(documents, embedding)

// prompt 去语义匹配
//提供检索器 不用去手工的prompt embedding 
//将向量数据库转换为检索器
//是一个标准入口，输入问题，输出最相关的文档列表
const retriever = vectorStore.asRetriever({
  k:3//最相似的3条
});


const question= "东东和光光是怎么成为朋友的";
console.log('='.repeat(80));
console.log(question);
console.log('='.repeat(80));
//检索 相关文档
//invoke 执行
//内部逻辑，将question 转为向量
//在向量数据库中计算距离 返回K个Document对象
//工作流编排
const docs = await retriever.invoke(question)

// 3. 展示检索结果（带相似度评分）
console.log('\n📚 [检索到的文档及相似度评分]')

const scoredResults = await vectorStore.similaritySearchVectorWithScore(question, 3)

docs.forEach((doc, i) => {
  const matched = scoredResults.find(([scoredDoc]) =>
    scoredDoc.pageContent === doc.pageContent
  )
  const score = matched ? matched[1] : null
  // 余弦距离转相似度: 距离越小越相似，1 - 距离 = 相似度
  const similarity = score != null && !Number.isNaN(score) ? ((1 - score) * 100).toFixed(1) : 'N/A'

  console.log(`\n[文档 ${i + 1}] 相似度: ${similarity}%${similarity !== 'N/A' ? ` (距离: ${score.toFixed(4)})` : ''}`)
  console.log(`  内容: ${doc.pageContent.substring(0, 60)}...`)
  console.log(`  来源: 第${doc.metadata.chapter}章 | ${doc.metadata.character} | ${doc.metadata.type}`)
})

// 4. 增强 (Augment) —— 拼接上下文
const context = docs
  .map((doc, i) => `[故事片段${i + 1}，来自第${doc.metadata.chapter}章]\n${doc.pageContent}`)
  .join('\n\n---\n\n')

// 5. 生成 (Generate) —— 把上下文 + 问题发给 LLM
const prompt = `你是一位讲友情故事的老师。请基于下面的故事片段来回答问题，用温暖生动的语言。如果故事中没有提到相关信息，请诚实地说"这个故事里还没有提到这个细节哦"。

${context}

问题：${question}

老师的回答：`

console.log('\n' + '='.repeat(80))
console.log('🤖 [LLM 生成的回答]')
console.log('='.repeat(80))

const answer = await model.invoke(prompt)
console.log(answer.content)

