# 跨域

- nginx 反向代理
    - 前端项目 index.html nginx
    - 发出的请求 /api
    - :3001/
- vite + mockjs dev
- websocket
    后端 sse server sent event
    服务器单向流式输出

    相应头
    Content-Type: text/event-stream
    Cache-Control: no-cache
    Connection:keep-alive
    QQ Wechat Socket 协议，双工通信
    不再是http 那种 只有浏览器发送数据，服务器也可以
    在线状态
    Socket 实时通信，聊天，直播
    Client端
    当他来到web端，websocket协议
    哔哩哔哩 弹幕


- http 之外的协议
    
    **单向**传输
    用户发起请求，服务器反馈，一般服务器是不可以主动向用户推送数据的
    server 伺服状态 等

    **see 流式**，服务器可以不断向浏览器推送数据 单向

    - websocket 协议
    qq，wechat
    实时聊天

- ws 库
    websocket 协议 实现
    - 链接的时候 ，url ws://localhost:8000/ws
    ws://localhost:8000/ws 分两步
    1.http://localhost:8000 http 链接服务器 Web Server 找到  只需要一次
    2.101 status code switch protocol 切换协议，websocket协议

    基于事件双向通信

websocket 协议可以跨域
http(s)跨域：不同域名，不同端口，不同协议，浏览器因为安全问题，不能直接跨域请求

websocket 协议 不需要遵守同源策略，可以跨域请求

## websocket 双工，为何不用于llm的流式输出？
一边生成一边输出，socket双向也可以