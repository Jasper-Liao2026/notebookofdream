import 'dotenv/config';
import {ChatOpenAI} from '@langchain/openai';

const model = new ChatOpenAI({
    modelName:process.env.MODEL_NAME,
    apiKey:process.env.OPENAI_API_KEY,
    temperature:0,
    configuration:{
        baseURL:process.env.OPENAI_API_BASE_URL,
    }
})

const parser = new JSONOutputParser();//解析器
const prompt = `
请介绍一下爱因斯坦的信息，请以JSON格式返回，
包含以下字段：姓名，出生日期，国籍，主要成就，著名理论
`
try{
    console.log("正在调用大模型...\n");
    const response = await model.invoke(prompt);
    console.log(response.content);

    const jsonContent = response.content.replace(/```json|```/g, '').trim();
    const jsonResult = JSON.parse(jsonContent);
    console.log('解析后的JSON结果:',jsonResult);
}catch(err){
    console.error(err.message)
}