//自动语音识别 Automatic Speech Recognition
// 知识库，语音先转成文本，文本向量 匹配 知识库中的文本向量，找到最相似的文本，作为识别结果
import "dotenv/config";
import tencentcloud from "tencentcloud-sdk-nodejs";
import fs from "fs";

const SECRTET_ID = process.env.SECRTET_ID;
const SECRET_KEY = process.env.SECRET_KEY;

const AsrClient = tencentcloud.asr.v20190614.Client;
const AUDIO_FILE = './output.mp3';
const client = new AsrClient({
    credential:{
        secretId:SECRTET_ID,
        secretKey:SECRET_KEY,
    },
    region:"ap-shanghai",
    profile:{
        httpProfile:{
            reqMethod:"POST",
            reqTimeout:30,
        }
    }
});

async function run(){
    // mp3是二进制文件，转成能描述二进制的base64字符串，再到腾讯云asr识别，返回识别结果
    const audioBase64 = fs.readFileSync(AUDIO_FILE).toString("base64");
    const params = {
        EngServiceType:"16k_zh",
        SourceType:1,//1:base64,2:url
        Data:audioBase64,
        DataLen:Buffer.byteLength(audioBase64),
        VoiceFormat:"mp3",
    }
    try{
        const data = await client.SentenceRecognition(params);
        console.log("识别结果",data.Result);

    }catch(err){
        console.error("识别失败",err.message);
    }
}

run()
.catch(err=>{
    console.error("识别失败",err.message);
})
