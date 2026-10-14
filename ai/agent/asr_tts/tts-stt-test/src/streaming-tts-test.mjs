import "dotenv/config";
import WebSocket from "ws";//tencent 流式tts ws 协议
import crypto from "node:crypto";//加密
import fs from "node:fs";//文件系统

const SECRET_ID = process.env.SECRET_ID; // 腾讯云 SecretId，用于身份验证
const SECRET_KEY = process.env.SECRET_KEY; // 腾讯云 SecretKey，用于生成签名

const APP_ID = process.env.APP_ID; // 腾讯云应用ID，用于指定TTS应用
const VOICE_TYPE = 101001; // 语音类型ID，指定使用的声音（如中文女声）
const OUTPUT_FILE = "output.mp3"; // 输出的音频文件名
const TEXT_INTERVAL_MS = 3000; // 多段文本发送间隔时间（毫秒）

const TEXTS = [ // 要转换为语音的文本数组
    "傍晚我还在为晚霞开心",
    "突然电话响起:系统崩了",
    "我心里一沉冲回办公室",
    "好在大家一起排查后终于恢复",
    "我长长松了一口气"
];

// 异步延迟函数，用于等待指定时间
// 使用示例: await sleep(3000) 表示等待3秒
const sleep = (ms) => new Promise((resolve)=>setTimeout(resolve,ms));
// 构建腾讯云TTS WebSocket连接URL，包含认证签名
function buildWsUrl(){
    const now = Math.floor(Date.now()/1000); // 当前时间戳（秒），用于签名和过期时间
    const sessionId = `session_${now}_${Math.random().toString(36).slice(2)}`; // 唯一会话ID，用于标识本次请求
    
    // API请求参数对象
    const params = {
        Action:"TextToStreamAudioWSv2", // API动作名称：文本到流式语音V2版本
        AppId:parseInt(APP_ID), // 应用ID，从环境变量获取
        Codec:"mp3", // 音频编码格式
        Expired:now + 3600, // 签名过期时间（当前时间+1小时）
        SampleRate:16000, // 采样率（16kHz）
        SecretId:SECRET_ID, // SecretId，用于身份验证
        SessionId:sessionId, // 会话ID
        Speed:0, // 语速（0为正常速度）
        Timestamp:now, // 时间戳
        VoiceType:VOICE_TYPE, // 语音类型
        Volume:5 // 音量（1-10）
    }
    
    const sortedKeys = Object.keys(params).sort(); // 排序后的参数键，用于生成签名
    // 签名字符串格式：key1=value1&key2=value2&...
    const signStr = sortedKeys.map((k)=>`${k}=${params[k]}`).join("&");

    // 原始签名字符串：HTTP方法 + host + 路径 + 参数
    const rawStr = `GETtts.cloud.tencent.com/stream_wsv2?${signStr}`;

    // 使用HMAC-SHA1算法生成签名
    const signature = crypto.createHmac("sha1",SECRET_KEY).update(rawStr).digest("base64");

    // 构建URL查询参数
    const searchParams = new URLSearchParams({
        ...params,
        Signature:signature, // 添加生成的签名
    });

    return{
        sessionId,
        url:`wss://tts.cloud.tencent.com/stream_wsv2?${searchParams.toString()}` // WebSocket安全连接URL
    }
}

async function sendTexts(ws,sessionId){
    for(let i = 0;i<TEXTS.length;i++){
        ws.send(JSON.stringify({session_id:sessionId,message_id:`msg_${i}`,action:"ACTION_SYNTHESIS",data:TEXTS[i]}));//ACTION_SYNTHESIS 合成语音提示
        console.log(`[文本]已发送:${TEXTS[i]}`);
        if(i<TEXTS.length-1){ await sleep(TEXT_INTERVAL_MS);//等待指定时间
        }
    }
    ws.send(JSON.stringify({session_id:sessionId,action:"ACTION_COMPLETE"}));//ACTION_COMPLETE 合成完成
    console.log("[文本]已发送ACTION_COMPLETE");
}

/**
 * 流式文本转语音函数
 * 连接到腾讯云TTS WebSocket服务，获取流式音频并保存为MP3文件
 * @throws {Error} 当环境变量SECRET_ID、SECRET_KEY或APP_ID未配置时抛出
 */
function streamTTS(){
    // 检查必要的认证配置是否已配置
    if (!SECRET_ID || !SECRET_KEY || !APP_ID){
        throw new Error("请现在 .env 配置SECRET_ID,SECRET_KEY,APP_ID")
    }
    // 构建腾讯云TTS WebSocket连接URL，包含认证签名
    const {url,sessionId} = buildWsUrl(); // url: WebSocket连接地址, sessionId: 会话标识
    // 创建WebSocket客户端连接到TTS服务
    const ws = new WebSocket(url);//链接ws服务器
    // 创建文件写入流，用于保存合成的音频数据（以追加模式打开）
    const writeStream = fs.createWriteStream(OUTPUT_FILE,{flags:"w"});
    let totalBytes = 0; // 累计写入的音频字节数，用于统计
    let closed = false; // 标记连接是否已关闭
    let sent = false; // 标记是否已向服务器发送文本数据

    // 关闭所有连接和流的辅助函数
    const closeAll = () =>{ // 该函数用于设置WebSocket事件监听器
        if(closed){
            return;
        }
        writeStream.end(()=>{
            console.log(`[保存] 音频已保存到${OUTPUT_FILE},共写入${totalBytes}字节`);
        });
        if(ws.readyState < WebSocket.CLOSED) ws.close();//readyState 代表链接状态，0:连接中，1:已连接，2:关闭中，3:已关闭
    }
        // 监听WebSocket连接建立事件
        ws.on("open",()=>{
            console.log("[链接]websocket已建立，等待服务器就绪...");
        })
        // 监听WebSocket消息事件，处理服务器返回的音频数据和状态消息
        ws.on("message",async(data,isBinary)=>{ // data: 接收到的消息数据, isBinary: 是否为二进制数据（音频流）
            if(isBinary){
                writeStream.write(data); // data: 二进制音频数据
                totalBytes += data.length;
                return;
            }

            try{
                // 解析JSON格式的状态消息
                const msg = JSON.parse(data.toString()); // msg: 解析后的服务器响应消息对象
                console.log("[消息]",JSON.stringify(msg));
                // 服务器就绪后标记已发送状态
                if(msg.ready ===1 && !sent){
                    sent = true;
                    await sendTexts(ws,sessionId);//发送文本
                }
                // 检查是否有错误响应（code不为0表示出错）
                if(msg.code&&msg.code !==0){
                    console.log(`[错误] code=${msg.code},message=${msg.message}`);
                    closeAll();
                }else if(msg.final ===1){ 
                    // final=1表示合成完成
                    console.log("[完成] 合成结束");
                    closeAll();
                }
                ws.on("close",()=>{
                    console.log("[关闭]websocket已关闭");
                    closeAll();
                })
            }catch(err){ // err: 解析JSON失败时的错误对象
                console.error("[错误] 解析消息失败",err.message);
                closeAll();
            }

        })
    }

streamTTS()