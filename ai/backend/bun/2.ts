function add(a:number,b:number):number{   //这里函数后面的:number是给返回值加了一个类型
    return a+b;
}

let a=1;
let b="2"
add(a,parseInt(b))// api转换
let c:number=add(a,Number(b))  //这是强制转换