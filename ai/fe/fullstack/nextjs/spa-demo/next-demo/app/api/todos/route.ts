// next.js 除了use client 都是后端
// /api 数据接口 仍然满足 app router约定
//route.ts 返回json 数据接口的
import {type Todo} from '../../todos/type';

let todos:Todo[]=[
    {id:1,title:'学习AppRouter',completed:false},
    {id:2,title:'next.js个人官网开发',completed:false},
]
// /api/todos get请求 restful
export async function GET(){
    //返回json 数据接口 next.js 封装好了Response
    return Response.json(todos);
}
export async function POST(req:Request){
    const body = await req.json();
    const newTodo:Todo={
        id:Date.now(),
        title:body.title,
        completed:false,
    }
    todos.push(newTodo)
    return Response.json(newTodo);
}