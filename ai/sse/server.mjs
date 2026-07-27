import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config({
    path: ['.env.local', '.env'],
});

const app = express();
const port = 3000;

// 允许前端跨域请求（5173 → 3000）
app.use(cors());

// 路由
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// 流式输出的 BFF 层，让前端调用
app.get('/stream', async (req, res) => {
    //prompt req 解析
    //fetch 请求到llm ＋ stream:true 流式输出
    // console.log(req.query.request);
    // res.json({
    //     prompt:req.query.prompt,
    // })
    const {prompt} = req.query;
    const endpoint = 'http://api.deepseek.com/v1/chat/completions';
    try{
        const response = await fetch(endpoint,{
            method:'POST',
            headers:{
                'Authorization':`Bearer ${process.env.DEEPSEEK_API_KEY}`,
            },
            body:JSON.stringify({
                model:'deepseek-v4-pro',
                stream:true,
                messages:[{role:'user',content:prompt}]
            })
        })
        console.log(response.body); //ReadableStream
    }catch(err){

    }
});

app.listen(port, () => {
    console.log(`服务器在${port}端口启动了`);
});
//后端轻量的 就这一个文件 为服务器端
//npm run dev vite服务
//node server.mjs 运行的是后端进程
console.log('我是一个在前端项目中藏着的BFF程序');
