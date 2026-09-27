/**
 * LangGraph 基础图工作流示例
 * 
 * 这个示例展示了最简单的工作流构建：
 * 1. 定义状态结构
 * 2. 创建节点
 * 3. 连接边形成流程
 * 4. 编译执行
 */

import {
    Annotation, // 定义工作流的状态结构，用于类型检查和状态管理
    END,        // 结束节点标记，表示工作流的终点
    START,      // 开始节点标记，表示工作流的起点
    StateGraph, // 状态图类，用于构建有向图工作流
} from '@langchain/langgraph';

/**
 * 定义工作流的状态注解
 * Annotation.Root 表示根状态对象
 * 内部可以定义多个字段，每个字段都有自己的 Annotation
 */
const StateAnnotation = Annotation.Root({
    // 定义 text 字段：用于存储在节点间传递的文本信息
    text:Annotation({
        default:()=>'',  // 初始值为空字符串
        // reducer 函数：定义状态如何更新
        // (_prev, next) => next 表示直接用新值覆盖旧值
        reducer:(_prev,next) =>next,
    })
})

/**
 * 定义节点函数
 * 节点函数接收当前状态，返回要更新的状态
 */

// step1 节点：将当前文本追加 "->step1"
const step1 = (state) =>({text:`${state.text}->step1`});

// step2 节点：将当前文本追加 "->step2"
const step2 = (state) =>({text:`${state.text}->step2`});

/**
 * 构建工作流图
 * 
 * 流程：
 * START(开始) -> step1 -> step2 -> END(结束)
 */
const graph = new StateGraph(StateAnnotation)
    // 添加 step1 节点
    .addNode("step1",step1)
    // 添加 step2 节点
    .addNode("step2",step2)
    // 添加边：START -> step1
    .addEdge(START,"step1")
    // 添加边：step1 -> step2
    .addEdge("step1","step2")
    // 添加边：step2 -> END
    .addEdge("step2",END)
    // 编译图结构
    .compile()

/**
 * 生成并打印 Mermaid 流程图
 * Mermaid 是一种文本到图表的工具，可以用简单的语法生成流程图
 * 这里用于可视化工作流的节点流转关系
 */
const drawable = await graph.getGraphAsync();   //获取图的内部结构
const mermaid = drawable.drawMermaid({withStyles:true}); //转换为Mermaid语法
console.log(mermaid)