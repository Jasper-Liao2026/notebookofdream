import fs from 'fs/promises'

//解决回调地狱
//es6   es8

//then 链式调用 爬楼梯
// fs.readFile('./file1.txt','utf-8')
//     .then(data=>{ //callback 优雅then 语义 好理解
//         console.log('file1.txt 内容：',data)
//         //promise 实例
//         // then 返回的promise ,继续then链式
//         return fs.readFile('./file2.txt','utf-8')
//     })
//     .then(data=>{
//         console.log('file2.txt 内容：',data)
//         return fs.readFile('./file3.txt','utf-8')
//     })

//es8 async/await 语法糖
//立即执行函数 IIFE
//es8 async/await 语法糖
//下面的这些只是语法糖 不是fs.readFileSync
//await 帮我们实现了流程控制，不需要手动处理.then 链式
//同步 -> js单线程，耗时性任务(block) -> 异步(event loop) -> callback(回调) -> 业务复杂(回调地狱) -> promise+then(略显复杂)
// -> async/await(es8语法糖)
// 异步代码同步化(可读性)，本质还是promise，异步中的微任务，setTimeout 是宏任务

(async () => {
  // console.log('111');
  const file1Data = await fs.readFile('./file1.txt', 'utf-8');
  console.log('file1', file1Data);
  const file2Data = await fs.readFile('./file2.txt', 'utf-8');
  console.log('file2', file2Data);
  const file3Data = await fs.readFile('./file3.txt', 'utf-8');
  console.log('file3', file3Data);
})();