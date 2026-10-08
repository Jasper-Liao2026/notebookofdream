import "dotenv/config";
import tencentcloud from "tencentcloud-sdk-nodejs";
import fs from "node:fs";

const secretId = process.env.SECRETID
const secretKey = process.env.SECRET_KEY

const TtsClient = tencentcloud.tts.v20190823.Client;
const client = new TtsClient({
    credential: {
        secretId,
        secretKey,
    },
    region:"ap-beijing",
    profile:{
        httpProfile:{
            endpoint:"tts.tencentcloudapi.com",
        }
    }
});

const parmas = {
    // Text:`下班路上，我还在为晚霞开心，突然电话响起:系统崩了。我的心一下揪紧了，冲击办公室时几乎是绝望的，可当
    // 大家一起排查、重启、屏幕终于恢复正常，我长长松了口气，笑着说:还好，我们没放弃`,
    Text:"hello",
    SessionId:"session-001",
    VoiceType:502006,
    Codec:"mp3",
}

client
    .TextToVoice(parmas)
    .then((data)=>{
        // console.log(data);
        //二进制缓冲区
        const audioBuffer = Buffer.from(data.Audio,"base64");//二进制缓冲区
        const outputPath = "./output.mp3";
        fs.writeFile(outputPath,audioBuffer,(err)=>{
            if(err){
                console.error(err);
                return;
            }
            console.log("文件写入成功");
        })
    })