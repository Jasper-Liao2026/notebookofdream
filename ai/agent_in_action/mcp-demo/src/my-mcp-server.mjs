import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {z} from 'zod'
//目前是假数据，未来可以走数据库
const database ={
    users:{
        '001':{id:'001',name:'张三',email:'zhangsan@example.com',role:'admin'},
        '002':{id:'002',name:'李四',email:'lisi@example.com',role:'user'},
        '003':{id:'003',name:'王五',email:'wangwu@example.com',role:'user'}
    }
}

const server =new McpServer({
    name:'my-mcp-server',
    version:'1.0.0',
})
server.registerTool('query_user',{
    description:'查询数据库中的用户信息，输入用户id，返回该用户的详细信息（姓名、邮箱、角色）',
    inputSchema: z.object({
        userId: z.string().describe('用户id,例如001')
    })
}, async({userId}) => {
    const user = database.users[userId]
    if (!user) {
        return {
            content: [
                { type: 'text', text: `用户ID为${userId}的用户不存在。可用的ID：001，002，003` }
            ]
        }
    }
    return {
        content: [
            { type: 'text', text: `用户${user.name}的详细信息如下：
                姓名：${user.name}
                邮箱：${user.email}
                角色：${user.role}
            `}
        ]
    }
})
const transport = new StdioServerTransport()
await server.connect(transport)