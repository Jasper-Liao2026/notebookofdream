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
    const conversation = [
        {role:'user',content:'我是素食主义者，而且对坚果过敏'},
        {role:'assistant',content:'我建议你避免吃坚果，因为坚果可能包含过敏原'},
        {role:'user',content:'我需要一个简单的列表，包含我需要避免的坚果'},
    ]

    const added = await client.add(conversation,{userId:USER_ID})
    log('added',added)
}
main()