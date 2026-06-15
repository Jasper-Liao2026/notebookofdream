// promise是es6 用于异步任务控制的最佳机制
const p=new Promise((resolve,reject)=>{
    console.log('许诺言')
    //放置耗时性任务
    setTimeout(()=>{
        // resolve()//履约
        reject("网络错误");//耗时性的异步任务，没有履约
    },2000)

});// 许承诺
console.log(p.__proto__);
p
    .then((data)=>{
        console.log(data)
        console.log('end')
    })
    .catch((err)=>{
        console.log(err)
    })
    .finally(()=>{
        console.log('finally')
    })
