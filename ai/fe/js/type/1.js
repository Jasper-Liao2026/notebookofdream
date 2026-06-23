//表示空，没有
//null
let a=null
console.log(a);

let obj={
    name:"alice",
    address:null
}
console.log(obj.address)

let largeObject={
    data:new Array(100000).fill("hgh")
}
// 手动回收内存
largeObject = null;

let b=a
b=2
console.log(a,b)

let obj1={name:"陈"}
let obj2=obj1
obj2.company="快手"
console.log(obj1.company)


