//commonjs老的，esm新的
const WebSocket = require('ws');
const http = require('http'); //node 内置的http 模块

//先要把http server 启动 web
const server = http.createServer((req,res)=>{
    res.writeHead(200,{
        'Content-Type':'text/event-stream',
    });
    res.end('WebSocket Server Running');

})

//基于http server再搭建socket协议
const wss = new WebSocket.Server({server,path:'/ws'})
//监听事件 有人链接
wss.on('connection',(ws)=>{
    console.log('client connected');

    ws.on('message',(msg)=>{
        console.log('Received:',msg.toString());
        ws.send('Hello from server!');
    });
})

server.listen(8000,()=>{
    console.log('listening on localhost:8000');
})