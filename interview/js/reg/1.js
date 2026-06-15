let str='13888888888'
// 描述一个匹配的规则
//一个字符一个字符匹配
//[]表示匹配的字符范围
let reg=/^1[3-9][0-9]{9}$/
//[0-9]可以用\d取代
console.log(reg.test(str))
console.log(typeof reg)

console.log(
    Object.prototype.toString.call(reg)
)