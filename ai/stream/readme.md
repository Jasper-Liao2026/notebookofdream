# 流式输出 streamable

一次性返回的，等待，等很久
    复杂的计算，推理生成，耗时久，让人等的不耐烦
    如何优化，一个一个token 推理生成，实时的展示
    api，计算机网络协议层去理解
    chatbot客户端 不断拼接token，流式输出就成了
llm chatbot 像打字机一样流式输出，体验很好
前端工程师来说有点复杂，ai产品的第一个关键用户体验

## 耗时
主要是推理所花费的时间(transform)和问题复杂度(难度和长度)

## 约定
- 服务器端约定 stream:true token生成之后就输出
- 客户端 发送 stream:true  表示流式输出

## 使用流式(streaming) 传输减少等待时间
用户体验的打造，前端的责任，必考内容，ai产品的核心体验

- vite前端项目中集成 deepseek apikey?
    vite 会帮我们读取.env.local
    vite 是脚手架，node 后端

## VUE基础
- .vue 后缀
    文件，也叫组件文件(component)
    facebook 网页由一万多个component组成
    组件就是组成网页的最小单位

## 封装 三部分
- template 模板 html
- script js 逻辑
- style 样式