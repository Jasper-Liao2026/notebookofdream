// fs FileSystem 是文件系统模块，用于操作文件和目录
import fs from 'fs' //没加 不直接启用/promise
const syncData =fs.readFileSync('test.txt','utf-8')     
//I/O 操作 可异步可同步 readFileSync 同步阻塞线程的执行
// 简单粗暴，性能问题差一点 同步
// JS 单线程 充斥着异步 高性能解决方案
// node 和前端环境不一样 可异步（node的优势） 可同步
//node 异步无阻塞 no block
// node 是 c++ 写出来的，封装了v8引擎（解析js代码），支持异步操作

console.log(syncData)
//异步 跳过执行后面的  将回调函数放入事件循环 event loop
//流程控制
//es6之前的老方法是回调函数
//回调函数处理异步有缺陷，es6 promise.then
fs.readFile('./test.txt','utf-8',(err,data)=>{
    //node第一个参数是err错误对象
    if(!err){
        console.log(data)
    }else{
        console.log(err)
        //如果是读取失败也是异步的
    }
})
console.log(111)


//先读取file1.txt，再读取file2.txt ，最后读取file3.txt
// js异步业务 流程控制越来越复杂，callback 太麻烦了
fs.readFile('./file1.txt','utf-8',(err,data)=>{
    if(!err){
        console.log(data)
    }else{
        console.log(err)
    }
    //读取file2.txt
    fs.readFile('./file2.txt','utf-8',(err,data)=>{
        if(!err){
            console.log(data)
        }else{
            console.log(err)
        }
        //读取file3.txt
        fs.readFile('./file3.txt','utf-8',(err,data)=>{
            if(!err){
                console.log(data)
            }else{
                console.log(err)
            }
        })
    })
})