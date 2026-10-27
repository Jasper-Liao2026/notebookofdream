// Record<K,V> 是ts内置的工具类型，表示键为K 类型，值为V类型的对象
type PromptVars = Record<string,string|number>

const prompt2 = '你是一个{role}，请用{language}回答问题：{question}';
//告诉函数，这个函数支持接收一个自定义类型
function parsePrompt<T extends PromptVars>(
    template:string,
    vars:T,
    defaults:Partial<T>={}
):string{
    const values = {
        ...defaults,
        ...vars,
    };
    return template.replace(
        /\{(\w+)\}/g,
        (_,key:string)=>{
            if(!(key in values)){
                throw new Error(`Missing required variable ${key}`)
            }
            return String(values[key])
        }
    )
}
const result  = parsePrompt<PromptVars>(
    prompt2,
    {
        role:"ai助手",
        language:"中文",
        question:"什么是ts"
    },
    {
        language:"中文"
    }
)
console.log(result)