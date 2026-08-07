//web worker 独立子线程计算
//不可以做dom api ，有自己的api
console.log('worker online');
//self 关键字
self.onmessage = (e) =>{
    const {num} = e.data
    console.log('Worker收到主线程任务，参数为：',e.data);
    let sum=0;
    for(let i=0;i<500000;i++){
        sum+=i*num;
    }

    self.postMessage({
        result:sum
    });
}
