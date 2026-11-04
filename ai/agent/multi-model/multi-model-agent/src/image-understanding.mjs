import 'dotenv/config';
import {ChatOpenAI} from '@langchain/openai';
import {HumanMessage} from '@langchain/core/messages';

const model = new ChatOpenAI({
    apiKey:process.env.OPENAI_API_KEY,
    model:'qwen-v1-plus',
    configuration:{
        baseURL:process.env.OPENAI_API_BASE_URL,
    }
})

const response = await model.invoke([
    new HumanMessage({
        content:[{
            type:'text',
            text:'请分析这张图片的内容：'},
            {
                type:'image_url',
                image_url:{
                    url:'https://oss-cn-hangzhou.aliyuncs.com/agent-bucket1000/ccc/ddd/hello.png'
                }
            }
        ]
    }),
])

console.log(response.content);