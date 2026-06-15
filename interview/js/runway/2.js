// 在浏览器眼里:
var myname                      //变量提升
function showName(){            //申明提升
    console.log('函数showName执行')
}

showName(); 
console.log(myname)
myname='蔡徐坤'