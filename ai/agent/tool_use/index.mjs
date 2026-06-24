import OpenAI from 'openai'
import dotenv from 'dotenv'
dotenv.config()

const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
})
//tool 配置
//JSON schema
//将函数降维为语言
//新旧范式的融合
const tools = [
    {
        "type":"function",
        "function":{
            "name":"get_closing_price",
            "description":"获取指定股票的收盘价",
            "parameters":{
                "type":"object",
                "properties":{
                    "name":{
                        "type":"string",
                        "description":"股票名称"
                    }
                },
                "required":["name"]
            }
        }
    }
]

async function sendMessage(messages){
    const res =await client.chat.completions.create({
        model:'deepseek-v4-pro',
        messages,
        tools,
        tool_choice:'auto'
    })
    return res;
}

async function main() {
    let messages = [
        { role: 'user', content: '青岛啤酒的收盘价' }
    ]

    // 第一步：调用大模型，模型会返回 tool_calls 而不是直接回答
    const response = await sendMessage(messages)
    const responseMessage = response.choices[0].message
    console.log('模型返回message对象', responseMessage)

    // 第二步：检查模型是否要求调用工具
    if (responseMessage.tool_calls) {
        // 将模型的回复加入消息历史
        messages.push(responseMessage)

        // 遍历每个 tool_call，执行对应的函数
        for (const toolCall of responseMessage.tool_calls) {
            const functionName = toolCall.function.name
            const functionArgs = JSON.parse(toolCall.function.arguments)

            let result = '未找到该函数'
            if (functionName === 'get_closing_price') {
                result = get_closing_price(functionArgs.name)
            }

            // 将工具调用结果加入消息历史
            messages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: result,
            })
        }

        // 第三步：将工具结果发回模型，让模型生成最终回复
        const finalResponse = await sendMessage(messages)
        console.log('模型最终回复', finalResponse.choices[0].message.content)
    } else {
        // 模型直接回答，没有调用工具
        console.log('模型直接回复', responseMessage.content)
    }
}

main()

//传统软件世界
function get_closing_price(name){
    if(name ==='青岛啤酒'){
        return'67.92'
    }else if(name ==='贵州茅台'){
        return '1488.21'
    }else{
        return '未找到该股票'
    }
}
