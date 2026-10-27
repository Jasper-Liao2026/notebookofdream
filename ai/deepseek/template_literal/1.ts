//声明自定义类型greeting
type Greeting = `Hello,${string}`;

const a:Greeting = `Hello,${'Deepseek'}`
type B = `id-${number}`
const b:B = `id-123`;
