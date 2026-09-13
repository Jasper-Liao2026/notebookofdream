const http = require('http');
const fs = require('fs');
const path = require('path');

const INDEX_FILE = path.join(__dirname, 'index.html');

const server = http.createServer((req,res)=>{
    if(req.url === '/'){
        fs.readFile(INDEX_FILE, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Failed to read index.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }else if(req.url === '/stream'){
        res.writeHead(200,{
            'Content-Type':'text/event-stream',
            'Cache-Control':'no-cache',
            'Connection':'keep-alive'
        })
        let words = ["你","好","欢迎"];
        let index = 0;
        const timer = setInterval(()=>{
            if(index >= words.length){
                clearInterval(timer);
                res.write('data: [DONE]\n\n');
                res.end();
                return;
            }
            //sse格式发送
            res.write(`data: ${words[index]}\n\n`);
            index++;
        },1000);
        
        req.on('close',()=>{
            clearInterval(timer);
        });
    }
})

server.listen(3000,()=>{
    console.log('服务器启动成功');
})