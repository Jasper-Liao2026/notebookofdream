import dotenv from 'dotenv';
import {join} from 'path';
dotenv.config({path:join(import.meta.dirname,'.env')});


import {ChatOpenAI} from '@langchain/openai'
//把大模型输出解析成纯字符串
//chain 上，不用那么复杂，直接给我们content内容
import{StringOutputParser} from '@langchain/core/output_parsers';
import {PromptTemplate} from '@langchain/core/prompts';
//使用prompt好复用
//agent中很多业务都是prompt驱动的，不同的用户，是同一套ai业务，只需要换身份就好，PromptTemplate
//会在ai工作流比较前的位置


//创意模型
const creativeModel = new ChatOpenAI({
    model:'deepseek-v4-pro',
    temperature:0.8,//增强创意的发散性
    topK:4,//仅从概率前4的词汇里采样，限制跑偏
    maxToken:600,
    apiKey:process.env.DEEPSEEK_API_KEY,
    configuration:{
        baseURL:'https://api.deepseek.com'
    }
})

const preciseModel = new ChatOpenAI({
    model:'deepseek-v4-pro',
    temperature:0.2,//增强创意的发散性
    topK:8,//更大的TopK ，保证信息的完整性
    maxToken:600,
    apiKey:process.env.DEEPSEEK_API_KEY,
    configuration:{
        baseURL:'https://api.deepseek.com'
    }
})

const storyPrompt = PromptTemplate.fromTemplate(
    '请写一篇短篇散文，主题{theme},风格温柔治愈，篇幅200字左右，不要分段，文字细腻又有画面感'
)

const outputParser= new StringOutputParser();
//工作流pipe一下 工作流的流转
//AI 工程复杂 设计好了ai工作流
const creativeChain = storyPrompt
    .pipe(creativeModel)
    .pipe(outputParser)

const preciseChain =storyPrompt
    .pipe(preciseModel)
    .pipe(outputParser) 

    
async function runWriteDemo(){
    const theme = "秋日山野晚风";
    console.log('创意写作模式');
    const creativeText = await creativeChain.invoke({theme});
    console.log(creativeText);

    console.log('严谨写实模式');
    const preciseText =await preciseChain.invoke({theme});
    console.log(preciseText);
}

runWriteDemo();