# 导入Python内置的操作系统模块，用于获取环境变量、操作文件路径等
import os
# 导入正则表达式模块，用于字符串匹配和查找
import re 
# 导入子进程模块，用于在全新进程中执行命令，实现环境隔离
import subprocess
# 导入路径模块，提供面向对象的路径操作
from pathlib import Path
# 导入JSON模块，用于处理JSON数据
import json 
# 从openai库导入OpenAI类，用于调用LLM API
from openai import OpenAI
# 导入dotenv模块，用于从.env文件加载环境变量
from dotenv import load_dotenv

# 加载.env文件中的环境变量，override=True表示覆盖系统已有的同名变量
load_dotenv(override=True)
# 打印DEEPSEEK_API_KEY环境变量，用于调试检查是否加载成功
print(os.getenv("DEEPSEEK_API_KEY"))
# 定义Agent的工作目录，使用Path.cwd()获取当前工作目录
# WORKDIR是被授权的、安全的操作目录，所有文件操作都在此目录下进行
WORKDIR = Path.cwd()

# 创建OpenAI客户端实例
# base_url从环境变量DEEPSEEK_BASE_URL获取，通常是DeepSeek API的地址
# api_key从环境变量DEEPSEEK_API_KEY获取，用于身份验证
client = OpenAI(
    base_url = os.getenv("DEEPSEEK_BASE_URL"),
    api_key = os.getenv("DEEPSEEK_API_KEY"),

)

# 下面是被注释掉的测试代码，用于测试API连接
# 调用OpenAI API创建聊天完成
# resp = client.chat.completions.create(
#     model = os.getenv("DEEPSEEK_API_MODEL"),  # 从环境变量获取模型名称
#     messages = [
#         {"role": "user", "content": "你好"}  # 用户消息
#     ]
# )
# 打印返回的消息内容
# print(resp.choices[0].message.content)

# 定义主Agent的系统提示词
# Python的隐式字符串拼接：括号内连续放置多个字符串会自动拼接成一个字符串
SYSTEM = (
    f"You are a coding agent at {WORKDIR}"  # f字符串，将WORKDIR变量的值嵌入到字符串中
    # 告诉Agent可以使用task工具来执行针对性探索或独立的子任务
    "Use task for focused exploration or a self-contained subtask"
)

# 定义子Agent的系统提示词，用于子任务
# 子Agent需要完成任务后返回简洁的最终答案
SUB_SYSTEM = (
    f"You are a coding agent at {WORKDIR}."  # f字符串，嵌入工作目录
    "Complete the given task,then return a concise final answer"  # 完成任务后返回简洁答案
)

# 定义安全路径函数，用于验证和返回安全的文件路径
# 参数p是字符串类型的路径
# 返回值是Path对象
# 此函数是所有agent公用的，确保路径不会超出工作目录，防止目录遍历攻击
def safe_path(p:str)->Path:
    # 使用pathlib的/运算符拼接路径，相当于路径拼接（不是除法）
    # WORKDIR / p 会将p拼接到WORKDIR后面，.resolve()会将相对路径转为绝对路径
    path = (WORKDIR / p).resolve()
    # 检查路径是否在工作目录内
    # is_relative_to()判断path是否是WORKDIR的子目录
    if not path.is_relative_to(WORKDIR):
        # 如果路径逃逸了工作目录，抛出ValueError异常
        raise ValueError(f"Path escapes workspace:{p}")
    # 返回安全的绝对路径
    return path

# 定义运行bash命令的函数，用于执行命令行
# 参数command是字符串类型的命令
# 返回值是命令执行结果的字符串
def run_bash(command:str)->str:
    # 定义危险命令列表，这些命令会被阻止执行
    dangerours = ["rm-rf /","sudo","shutdown","reboot","> /dev/"]
    # any()函数：如果列表中任意一个元素满足条件就返回True
    # 检查command中是否包含任意一个危险关键词
    if any(d in command for d in dangerours):
        return "Error:Dangerous command blocked"  # 阻止危险命令

    try:
        # 使用subprocess.run()执行命令
        # shell=True: 使用shell解释器执行命令
        # cwd=WORKDIR: 在指定工作目录下执行命令
        # capture_output=True: 捕获标准输出和标准错误
        # text=True: 将输出转换为字符串
        # errors="replace": 编码错误时用替换字符
        # timeout=120: 超时时间120秒
        r = subprocess.run(command,shell = True,cwd = WORKDIR,
            capture_output = True,text = True, errors = "replace", timeout = 120
        )
        # 将标准输出和标准错误合并，并去除首尾空白
        out = (r.stdout + r.stderr).strip()
        # 三元运算符：如果out有内容则返回前5000个字符，否则返回"(no output)"
        return out[:5000] if out else "(no output)"
    # 如果命令执行超时（超过120秒），捕获TimeoutExpired异常
    except subprocess.TimeoutExpired:
        return "Error:Timeout (120s)"
    # 捕获文件未找到错误和系统错误，元组表示同时捕获多种异常类型
    except (FileNotFoundError,OSError) as e:
        return f"Error:{e}"

# 读文件的工具
def run_read(path:str,limit:int =None)->str:
    # 返回一个安全的路径
    # read_text() 读取文件内容，返回字符串 同步操作
    # splitlines() 将字符串按行分割成列表
    try:
        lines = safe_path(path).read_text(encoding="utf-8").splitlines()
        if limit and limit<len(lines):
            lines = lines[:limit] + [f"...({len(lines)-limit}more)"]
        return "\n".join(lines)[:50000]  # 将列表按行拼接成字符串返回
    except Exception as e:
        return f"Error:{e}"

def run_write(path: str, content: str) -> str:
    # try：尝试执行写文件逻辑，发生异常直接跳到except
    try:
        # 校验路径安全，得到目标文件的Path对象，防止逃出工作目录
        fp = safe_path(path)
        # 获取文件所在文件夹；parents=True自动创建多级父目录；exist_ok=True目录存在就不报错
        fp.parent.mkdir(parents=True, exist_ok=True)
        # 以utf8编码，把传入的content文本写入文件
        fp.write_text(content, encoding="utf-8")
        # 写入成功，返回提示，告诉AI一共写了多少字节
        return f"Wrote {len(content)} bytes"
    # 捕获所有异常：权限不足、路径非法等各种错误
    except Exception as e:
        # 出错时，返回错误信息给大模型
        return f"Error: {e}"


def run_edit(path: str, old_text: str, new_text: str) -> str:


    # 尝试执行编辑逻辑，出错就跳到except
    try:
        # 校验路径安全，拿到文件Path对象，防止逃出工作目录
        fp = safe_path(path)
        # 读取文件全部内容，utf-8编码
        content = fp.read_text(encoding="utf-8")
        # 如果待查找的旧文本不在文件里面
        if old_text not in content:
            # 返回错误提示，直接结束函数，不修改文件
            return f"Error: Text not found in {path}"
        # 替换：只替换第1处匹配的旧文本，写回原文件
        fp.write_text(content.replace(old_text, new_text, 1), encoding="utf-8")
        # 修改成功，返回提示信息
        return f"Edited {path}"
    # 捕获所有异常（文件不存在、权限问题等）
    except Exception as e:
        # 出现异常，返回错误详情给大模型
        return f"Error: {e}"

#启动子agent，传入用户任务文本，返回执行结果
def run_subagent(prompt:str)->str:
    sub_message = [{"role":"user","content":prompt}]
    #最多尝试30次
    #下标我不用，占位置
    for _ in range(30):
        response = client.chat.completions.create(
            model = Model,
            messages = [{"role":"system","content":SUB_SYSTEM}] + sub_message,  # 系统消息 + 用户消息
            tools = CHILD_TOOLS,  # 子Agent可用的工具
            max_tokens = 8000
        )
        #取出模型返回的第一条消息对象
        msg = response.choices[0].messages
        #把模型返回消息转成字典，加到对话历史，下一轮ai能用到
        sub_message.append(msg.model_dump())

        if response.choices[0].finish_reason != "tool_calls":  # 如果模型回复不是工具调用，则打印内容并退出循环
            break
        results = []
        for tool_call in msg.tool_calls:
            func_name = tool_call.function.name
            #json格式的工具参数字符串，转成python字典
            args = json.loads(tool_call.function.arguments)
            handler = TOOL_HANDLERS.get(func_name)
            #把字典展开
            output = handler(**args) if handler else f"Unknown tool:{func_name}"
            results.append({
                "role":"tool",
                "tool_call_id":tool_call.id,
                "content":str(output)[:50000]
                })
            sub_message.extend(results)
        return msg.content or "(no summary)"
#工具名字和对应的执行函数映射字典


TOOL_HANDLERS = {
    # lambda 表达式可以用于简洁的创建匿名函数
    "bash":lambda **kw:run_bash(kw["command"]),
    "read_file":lambda **kw:run_read(kw["path"],kw.get("limit")),
    "write_file":lambda **kw:run_write(kw["path"],kw["content"]),
    "edit_file":lambda **kw:run_edit(kw["path"],kw["old_text"],kw["new_text"]),
}



    
# 定义子Agent可用的工具列表（只有一个bash工具）
# JSON格式的工具定义，用于告诉LLM有哪些函数可以调用
CHILD_TOOLS = [
  {
    "type": "function",
    "function": {
      "name": "bash",
      "description": "Run a shell command.",
      "parameters": {
        "type": "object",
        "properties": {
          "command": {
            "type": "string"
          }
        },
        "required": ["command"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "read_file",
      "description": "Read file contents.",
      "parameters": {
        "type": "object",
        "properties": {
          "path": {"type": "string"},
          "limit": {"type": "integer"}
        },
        "required": ["path"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "write_file",
      "description": "Write content to file.",
      "parameters": {
        "type": "object",
        "properties": {
          "path": {"type": "string"},
          "content": {"type": "string"}
        },
        "required": ["path", "content"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "edit_file",
      "description": "Replace extract text in file.",
      "parameters": {
        "type": "object",
        "properties": {
          "path": {"type": "string"},
          "old_text": {"type": "string"},
          "new_text": {"type": "string"}
        },
        "required": ["path", "old_text", "new_text"]
      }
    }
  }

]

# 定义父Agent可用的工具列表（包含task工具）
# task工具用于创建子Agent，有独立的上下文但共享文件系统
# PARENT_TOOLS和CHILD_TOOLS都指向同一个列表对象
PARENT_TOOLS  = CHILD_TOOLS + [
    {
        "type":"function",
        "function":{
            "name":"task",
            "description":"Spawn a subagent with fresh context.It shares the filesystem but not conversation history",
            "parameters":{
                "type":"object",
                "properties":{
                    "command":{
                        "type":"string",
                        "description":"Short description of the task"  # 任务描述
                    }
                },
                "required":["command"]
            }
       }
    }

    
]

def agent_loop(message:list):
    while True:
        response = client.chat.completions.create(
            model = Model,
            messages = [{"role":"system","content":SYSTEM}] + message,  # 系统消息 + 用户消息
            tools = PARENT_TOOLS,  # 父Agent可用的工具
            max_tokens = 8000,  # 最大返回token数
        )
        msg = response.choices[0].message
        # 把模型回复json格式字符串 添加到消息列表
        message.append(msg.model_dump())
        if response.choices[0].finish_reason != "tool_calls":  # 如果模型回复不是工具调用，则打印内容并退出循环
            return 
        results = []
        #Tool Calls
        msg = response.choices[0].message
        if msg.tool_calls:
            results = []
            for tool_call in msg.tool_calls:
                func = tool_call.function
                args = json.loads(func.arguments) # 解析函数参数为JSON对象
                #主agent分任务
                if func.name == "task":
                    # subtask 包含任务的类型
                    desc = args.get("description","subtask")
                    prompt = args.get('prompt',"")
                    print(f">task({desc}):{prompt[:80]}")
                    #启动子agent
                    #只关注结果
                    output = run_subagent(prompt)
                else:
                    #主agent 也能自己干任务
                    handle = TOOL_HANDLERS.get(func.name)
                    output = handle(**args) if handle else f"Unknown tool:{func.name}"

                results.append({
                    "role":"tool",
                    "tool_call_id":tool_call.id,
                    "content":str(output)
                })
            messages.extend(results)

if __name__ == "__main__":
    print("Subagent - fresh message,final text returns")
    print("Enter a question,press Enter to send.Type q to quit.\n")
    history = [] #创建一个空列表
    while True:
        try:
            query = input(">> ")
        # 中断    ctrl+c  ctrl+d
        except (EOFError,KeyboardInterrupt): #当输入流关闭或者用户按下Ctrl+C时，捕获异常并退出循环
            break
        print(query)
        if query.strip().lower() in ("q","quit","exit"):  # 如果用户输入q、quit或exit，则退出循环
            break
        history.append({"role":"user","content":query})
        agent_loop(history)