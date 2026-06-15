//http请求llm接口
//bun 代替npm 做包管理器
import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config();

async function chat(){
//llm 可能会出错，异常
//timeout network,llm忙 ,apikey
try{
    //GET 请求有长度上限
    //对于apikey GET不安全 这是明文输入
    //图片 上传 post 请求体
    //请求行,url,method,http version
    //请求头 Authorization apikey
    //请求体 body
    //fetch http 请求api
    //axios http 请求的框架，封装了fetch，企业级别

    const res=await axios.post(
        `${process.env.DEEPSEEK_BASE_URL}`,
        {//请求体
            model:'deepseek-v4-pro',
            messages:[{
                role:'user',
                content:'你好，介绍一下Bun'
            }]
        },
        {
            headers:{
                'Content-Type':"application/json",
                Authorization:`Bearer ${process.env.DEEPSEEK_API_KEY}`,
            }
        }

    ) 
    //axios默认在响应前面加上data
    console.log(res.data.choices[0].message.content)
}catch(err){
    console.log(err.message);
}
}

chat();