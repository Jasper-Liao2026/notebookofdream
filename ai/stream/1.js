const encoder = new TextEncoder();
// 字符串转Uint8Array二进制
const bytes = encoder.encode("你好");
console.log(bytes);

const decoder = new TextDecoder();
//二进制转回字符串
const str = decoder.decode(bytes);
console.log(str); //你好