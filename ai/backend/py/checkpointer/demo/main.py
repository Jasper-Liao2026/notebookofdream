from typing import TypedDict,Literal
# python 的静态类型检测，只在ide里生效，运行不强制校验
# TypeDict 用来给字典规定固定的键和类型

from fastapi import FastAPI
from langgraph.graph import StateGraph,START,END
#检查点 中断，状态 用内存保存
from langgraph.checkpoint.memory import MemorySaver
from pydantic import BaseModel
# langgraph 多用途指令对象，能更新状态，动态跳转节点
from langgraph.types import Command

class WorkFlowState(TypedDict):
    step:int
    msg:str

# 工作节点1
def node1(state:WorkFlowState) -> dict:
    print("执行节点1")
    return {"step":1,"msg":"节点1执行"}

def node2(state:WorkFlowState) -> dict:
    print("执行节点2")
    return {"step":2,"msg":"节点2执行，等待人工审核"}

def human_review(state:WorkFlowState) -> dict:
    print("执行人工审核")
    return {"step":3,"msg":"人工审核完成"}
def node4(state:WorkFlowState) -> dict:
    print("执行节点4 流程结束")
    return {"step":4,"msg":"流程结束"}
builder = StateGraph(WorkFlowState)
builder.add_node("node1",node1)
builder.add_node("node2",node2)
builder.add_node("human_review",human_review)
builder.add_node("node4",node4)

#入口：从 START 进入第一个节点
builder.add_edge(START,"node1")
builder.add_edge("node1","node2")
builder.add_edge("node2","human_review")
builder.add_edge("human_review","node4")
builder.add_edge("node4",END)

# 内存检查点存储器 先保存当前状态，停下来
# 从这个保存状态恢复，继续执行
checkpointer = MemorySaver()    
graph = builder.compile(
    #检查点 标记中断 保存当下状态，便于恢复
    checkpointer=checkpointer,
    #在人工审核节点前中断
    interrupt_before=["human_review"]
)

app = FastAPI(title="LangGraph Human-in-the-loop Demo")
#用户输入 校验
class ResumeRequest(BaseModel):
    approved:bool

def make_config(thread_id:str)->dict:
    return{
        "configurable":{
            # thread_id 是会话唯一标识
            "thread_id":thread_id
        }
    }
#agent 运行 会话状态
@app.post("/start")
def start_workflow(thread_id:str="demo-thread=001"):
    config = make_config(thread_id)
    # 暂停后的状态
    result = graph.invoke({"step":0,"msg":""},config)
    print(result)
    # 下一个节点等控制信息的完整状态视图
    snapshot = graph.get_state(config)
    print(snapshot)
    return {
        "status":"interrupted",
        "thread_id":thread_id,
        "current_state":result,
        "next_nodes":list(snapshot.next),
        "message":"流程已经暂停，等待人工审核"
    }

@app.post("/resume")
def resume_workflow(req:ResumeRequest,thread_id:str="demo-thread=001"):
    config = make_config(thread_id)
    if not req.approved:
        return {"status":"rejected","message":"用户拒绝继续，流程已暂停","thread_id":thread_id}
    # 从checkpointer 恢复状态，继续执行
    final_result = graph.invoke(Command(resume=True),config)
    snapshot = graph.get_state(config)
    return {
        "status":"completed" if len(snapshot.next)==0 else "interrupted",
        "thread_id":thread_id,
        "final_result":final_result,
        "next_nodes":list(snapshot.next),
        "message":"流程继续继续执行"
        }

@app.get("/state")
def get_state(thread_id: str = "demo-thread-001"):
  config = make_config(thread_id)
  snapshot = graph.get_state(config)
  return {
    "thread_id": thread_id,
    "values": snapshot.values,
    "config": snapshot.config,
    "next_nodes": list(snapshot.next),
  }