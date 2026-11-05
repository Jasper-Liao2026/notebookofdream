import 'dotenv/config'
import {MemoryClient} from 'mem0ai'
//用户id
const USER_ID = 'demo_user'

function log(title,data){
    console.log(`\n===${title}===`)
    console.log(typeof data === 'string' ? data : JSON.stringify(data,null,2))

}
async function main(){
    const client = new MemoryClient({apiKey:process.env.MEM0_API_KEY})
    // const conversation = [
    //     {role:'user',content:'我是素食主义者，而且对坚果过敏'},
    //     {role:'assistant',content:'我建议你避免吃坚果，因为坚果可能包含过敏原'},
    //     {role:'user',content:'我需要一个简单的列表，包含我需要避免的坚果'},
    // ]

    // const added = await client.add(conversation,{userId:USER_ID})
    // log('added',added)
    const searchResult = await client.search("用户的饮食限制是什么，中文回答",{
        filters:{user_id:USER_ID},
        topK:5
    })
    log('搜索记忆',searchResult);

    const allMemories = await client.getAll({
        filters:{user_id:USER_ID},
        pageSize:10
    })
    log('所有记忆',allMemories);

    // getAll 可能返回数组，也可能返回 { results: [...] }，两种都兼容
    const list = Array.isArray(allMemories) ? allMemories : allMemories.results ?? []
    const firstMemory = list[0]
    if(!firstMemory?.id){
        console.log('没有可更新的记忆')
        return
    }

    const memory = await client.get(firstMemory.id)
    log('第一个记忆',memory)

    // 取不到正文就不要拼，否则会把记忆覆盖成 "undefined(已通过示例脚本更新)"
    const text = memory.memory ?? firstMemory.memory
    if(!text){
        console.log('这条记忆没有正文，跳过更新')
        return
    }

    const updated = await client.update(firstMemory.id,{
        text:`${text}(已通过示例脚本更新)`
    })
    log('更新记忆',updated)

    const history = await client.history(firstMemory.id)
    
    log('记忆历史',history)

    if(process.argv.includes('--cleanup')){
        const deleted = await client.deleteAll({userId:USER_ID})
        log('删除所有记忆',deleted)
    }else{
        console.log('更新完成')
    }
}
main()