import client from './client.mjs'

const main = async () => {
    try {
        const result = await client.chat.completions.create({
            model: 'deepseek-v4-pro',
            messages: [
                {
                    role: 'system',
                    content: '你是一个足球领域专家，请尽量帮我回答与足球相关的问题',
                },
                {
                    role: 'user',
                    content: 'c罗是哪个国家的足球运动员?',
                },
                {
                    role: 'assistant',
                    content: 'c罗是葡萄牙的足球运动员',
                },
                {
                    role: 'user',
                    content: '内马尔呢？',
                },
            ],
        })

        const { reasoning_content, content } = result.choices[0].message

        // 推理内容只有 reasoning 模型才会返回，普通 chat 模型不会有
        if (reasoning_content) {
            console.log('思考过程:')
            console.log(reasoning_content)
        }

        console.log('最终答案:')
        console.log(content)
    } catch (err) {
        console.error('调用失败:', err.message)
    }
}

main()