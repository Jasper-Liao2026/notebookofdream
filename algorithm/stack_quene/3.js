//js早期没有class ，约定大写构造函数
function Greeting(name){
    this.name=name
}
Greeting(new Greeting('蔡徐坤'))
Greeting.prototype.say=function(){
    console.log(`我叫${this.name},高兴认识你`)
}
const cxk=new Greeting('蔡徐坤')
console.log(cxk)
cxk.say()
