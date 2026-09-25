/**
 * LangGraph 中断(Interrupt)示例
 * 
 * 这个示例演示了如何在 LangGraph 工作流中使用 interrupt 功能
 * 来暂停执行并等待用户确认后继续
 */

import {
    Annotation, // 定义工作流的状态结构，用于类型检查和状态管理
    END,       // 结束节点标记，表示工作流的终点
    START,     // 开始节点标记，表示工作流的起点
    StateGraph,// 状态图类，用于构建有向图工作流
    Command,
    interrupt  // 中断函数，用于暂停工作流等待用户输入
} from '@langchain/langgraph';

/**
 * 定义工作流的状态注解
 * - reducer: 状态合并函数，当多个节点更新状态时如何合并结果
 * - default: 状态的默认值
 */
const StateAnnotation = Annotation.Root({
    // reducer 函数：简单的覆盖合并，新的值会替换旧的值
    reducer:(_prev,next)=>next,
    // default 函数：返回初始状态值（空字符串）
    default:()=>""
})

/**
 * 第一个节点：显示转账信息
 * 这个节点返回要执行的操作摘要
 */
const showTransfer = () =>({
    actionSummary:"向张三转账100元"
})

/**
 * 第二个节点：等待用户确认
 * 使用 interrupt() 暂停工作流，直到用户在终端输入确认
 * 
 * interrupt() 会：
 * 1. 暂停图执行
 * 2. 将提示信息发送给用户
 * 3. 等待用户输入后恢复执行
 * 4. 返回用户的输入内容
 */
const waitConfirm =()=>{
    // 调用 interrupt 暂停工作流
    // hint: 显示给用户的提示信息
    // actionSummary: 当前操作的摘要信息
    const text = interrupt({
        hint:"终端里输入[确认]继续转账或者备注后回车，图才会继续",
        actionSummary:state.actionSummary,
    });
    // 将用户输入保存到状态中
    return {userInput:String(text)}
}

/**
 * 构建工作流图
 * 
 * 流程：
 * START(开始) -> showTransfer(显示转账信息) -> waitConfirm(等待确认) -> END(结束)
 */
const graph = new StateGraph(StateAnnotation)
    // 添加第一个节点：显示转账信息
    .addNode("showTransfer",showTransfer)
    // 添加第二个节点：等待确认
    .addNode("waitConfirm",waitConfirm)
    // 添加边：START -> showTransfer
    .addEdge(START,"showTransfer")
    // 添加边：showTransfer -> waitConfirm
    .addEdge("showTransfer","waitConfirm")
    // 添加边：waitConfirm -> END
    .addEdge("waitConfirm",END)
    // 编译图，启用检查点保存（MemorySaver 内存存储）
    .compile({checkpointer:new MemorySaver()})

/**
 * 生成并打印 Mermaid 流程图
 * 用于可视化工作流的结构
 */
const drawable = await graph.getGraphAsync();
const mermaid = drawable.drawMermaid({withStyles:true});
console.log(mermaid)

// 配置信息，用于标识这次运行（类似会话ID）
const config = {configurable:{thread_id:"interrupt-demo"}}