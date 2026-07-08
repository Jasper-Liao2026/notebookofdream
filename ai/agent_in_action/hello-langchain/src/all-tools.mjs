import {tool} from '@langchain/core/tools'
import fs from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import { spawn } from 'node:child_process'
const readFileTool = tool(
    async({ filePath }) => {   // 功能函数
        const content = await fs.readFile(filePath, 'utf-8');
        // 时刻反馈Agent 执行消息
        // Agent 任务可能很复杂,很耗时，需要给用户反馈 用户可能
        // 太久没有看到反馈， 退出
        console.log(`[工具调用] read_file(${filePath})
        成功读取 ${content.length} 字节`)
        return content;
    },
    {
        name: 'read_file',
        description: `用此工具来读取文件内容，当用户要求读取文件、
        查看代码、分析文件内容时，调用此工具。输入文件路径（
        可以是相对路径或绝对路径）`,
        schema: z.object({
            filePath: z.string().describe('要读取的文件路径')
        })
    }
)

//写文件
const writeFileTool=tool(
    //path 模块 专门的路径模块 Agent执行正确服务 
    //path 路径 /src/all-tool.mjs 路径模块
    async({filePath,content})=>{
        // 1.确认路径是否存在
        // 2.写入文件 utf-8
        // 3.容错处理
        try{
            const dir=path.dirname(filePath)
            console.log(dir,'目录')
            //已存在 目录不创建 
            await fs.mkdir(dir,{recursive:true})
            //写入文件
            await fs.writeFile(filePath,content,'utf-8')
            console.log(`[工具调用] write_file(${filePath})
            成功写入 ${content.length} 字节`)
            return `成功写入 ${filePath}`
        }catch(err){
            console.log(`[工具调用] write_file(${filePath}) 失败 ${err.message}`)
            return `写入文件失败 ${err.message}`
        }
    },
    {
        name:'write_file',
        description:'向指定路径写入文件内容，自动创建目录',
        schema:z.object({
            filePath:z.string().describe('文件路径'),
            content:z.string().describe('要写入的文件内容')
        })
    }

)

//列出目录内容工具 

const listDirectoryTool = tool(
    async ({directoryPath})=>{
        //后端以稳定为主 
        try{
            const files=await fs.readdir(directoryPath)
            console.log(`[工具调用] list_directory(${directoryPath})
            成功列出 ${files.length} 个文件`)
            return files.map(file=>`${directoryPath}/${file}`)
        }catch(err){
            console.log(`[工具调用] list_directory(${directoryPath}) 失败 ${err.message}`)
            return `列出目录失败 ${err.message}`
        }
    }
    ,{
        name:'list_directory',
        description:'列出指定目录下的所有文件和文件夹',
        schema:z.object({
            directoryPath:z.string().describe('目录路径')
        })
    }
)
//执行命令工具(带实时输出)
const executeCommandTool = tool(
    async ({command, directoryPath})=>{
        const cwd = directoryPath || process.cwd()
        console.log(`[工具调用] execute_command(${command}) 在 ${cwd} 执行`)
        return new Promise((resolve)=>{
            const [cmd,...args] = command.split(' ')
            const child = spawn(cmd, args, {
                cwd,
                stdio:'inherit',
                shell:true,
            })
            let errorMsg=''
            child.on('error',(err)=>{
                errorMsg=err.message
            })
            child.on('close',(code)=>{
                if(code==0){
                    console.log(`[工具调用] execute_command(${command}) 成功执行`)
                    resolve(`命令行成功执行 ${command}`)
                }else{
                    console.log(`[工具调用] execute_command(${command}) 退出 ${errorMsg}，退出码 ${code}`)
                    resolve(`命令执行失败，退出码 ${code}\n 错误信息：${errorMsg}`)
                }
            })
        })
    },
    {
        name:'execute_command',
        description:'执行指定命令，支持指定工作目录，实时显示输出',
        schema:z.object({
            command:z.string().describe('要执行的命令'),
            directoryPath:z.string().describe('工作目录')
        })
    }
)

export {
  readFileTool,
  writeFileTool,
  listDirectoryTool,
  executeCommandTool
}