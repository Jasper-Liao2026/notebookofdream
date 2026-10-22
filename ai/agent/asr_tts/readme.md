# 给Agent 加上语音交互: ASR+TTS

常用的Agent都有语音功能

语音输入会转成文本(ASR)，大模型的回答会通过语音朗读（TTS），可以切换音色

点击录音，输入一段语音，服务器端提供接口来转文字，之后用大模型生成回答
流式SSE返回文字，同时用websocket 返回流式语音
这样就可以实现语音输入、流式的文字、语音输入
为啥不直接用sse 返回音频数据呢？
因为SSE 是基于HTTP的文本协议，需要base64 才行，传这种二进制数据还是websocket更合适
SSE是基于GET请求

Content-Type: text/event-stream

## ASR 前端功能
- 静态服务器@nestjs/serve-static
- 录音功能
asr.html 语音交互
navigator.mediaDevices.getUserMedia 
- 二进制音频 提交到nestjs 服务端 
- 服务端再调用腾讯云asr接口 返回文本
- 向大模型发送流式请求 ssr 
- 显示文本