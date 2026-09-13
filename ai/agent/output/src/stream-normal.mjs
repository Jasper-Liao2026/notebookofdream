//流式输出
import "dotenv/config";
import {ChatOpenAI} from "@langchain/openai";

const model = new ChatOpenAI({
    modelName:process.env.MODEL_NAME,
    apiKey:process.env.OPENAI_API_KEY,
    temperature:0,
    configuration:{
        baseURL: process.env.OPENAI_BASE_URL,
    },
})

const prompt = `详细介绍Mozart的音乐风格`;
console.log("普通流式输出演示:(无结构化)\n");
//llm api 容错
try{
    //invoke 同步输出
    //stream 流式输出
    const stream = await model.stream(prompt);
    //stream水流，管子，chunk一个数据块
    let fullContent = '';
    let chunkCount = 0;
    console.log('接受流式数据');
    for await (const chunk of stream){
        chunkCount++;
        const content = chunk.content;
        fullContent += content;
        process.stdout.write(content);//实时显示流式文本
    }

    console.log(`\n\n共接收${chunkCount}个数据块`);
    console.log(`完整内容${fullContent}`);
}catch(err){
    console.error(err);
}