# 结构化大模型输出：

## 流式输出
- stream:true 开启流式输出
- 水管，一头接着llm server，一头 客户端，不断地有token 流向客户端
buffer

## stream 服务器端本质
- llm server
- http 协议
  基于请求响应的简单协议
- 响应？response
  - 同步
  - 流式？pipe

## SSE 
Server Sent Events
服务器单向不停地往浏览器推送消息，相比传统的http同步传输，请求，响应，断开链接？
浏览器建立一条长链接，服务器一点一点(chunk发数据)，也就是流式输出
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection:keep-alive
```

## EventSource 类
用于链接SSE，给他url
sse 不只有llm返回  股票
stream fs流 pipe一下
当服务器端有新的数据chunk到达之后，会触发onmessage事件

## outputparser
json -> 继续执行 

大模型按照我们的格式要求，返回一个json
key:value
JSON.parse()

## 失败了
json 固定格式输出，被markdown 格式包裹，llm输出常是markdown格式
这是展示需要

- 移除```json  ```包裹
- 正则 replace 方法

prompt output 技巧 -> llm 返回markdown格式 -> 正则业务取出md格式 -> JSON.parse()
每次AI调用的常见业务，langchain 提供相应的业务API，省去开发的复杂度

## JSONOutputParser
langchain 用来解析json结果的
约束返回格式json，JSON.parse()
parser.getFormatInstructions() 获取解析规则
parser.parse() 解析json字符串

本质就是通过getFormatInstructions() 在prompt里添加对output的结构化格式约定
parser.parse()取出markdown 拿到json

## StructuredOutputParser
- fromZodSchema
- fromNamesDescription
