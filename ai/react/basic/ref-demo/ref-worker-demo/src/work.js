console.log('worker online');
// 给主线程发消息确认自己已启动
self.postMessage('Worker 已启动，向主线程问好！');