/**
 * LangGraph 循环重试示例
 * 
 * 这个示例展示了如何在 LangGraph 中实现循环逻辑
 * 模拟一个场景：尝试多次，直到成功或达到最大次数
 */

import {
    Annotation, // 定义工作流的状态结构，用于类型检查和状态管理
    END,        // 结束节点标记，表示工作流的终点
    START,      // 开始节点标记，表示工作流的起点
    StateGraph, // 状态图类，用于构建有向图工作流
} from '@langchain/langgraph';

/**
 * 定义工作流的状态注解
 */
const StateAnnotation = Annotation.Root({
    // tries: 记录尝试次数
    tries:Annotation({
        reducer:(_prev,next)=>next,
        defaultValue:0,  // 初始值为 0
    }),
    // ok: 标记是否成功
    ok:Annotation({
        reducer:(_prev,next)=>next,
        default:()=>false,  // 初始为 false
    }),
    // message: 存储消息/日志
    message:Annotation({
        reducer:(_prev,next)=>next,
        default:()=>[],  // 初始为空数组
    })
})

/**
 * attempt 节点：执行一次尝试
 * 
 * 逻辑：
 * 1. 增加尝试次数
 * 2. 判断是否达到成功条件（这里模拟尝试3次后成功）
 * 3. 记录尝试日志
 */
const attempt = (state) =>{
    // 当前尝试次数 + 1
    const retries = state.tries + 1;
    // 假设尝试 3 次后算"成功"
    const ok = retries >=3;
    // 返回更新后的状态
    return {
        tries:tries,      // 更新尝试次数
        ok:ok,            // 更新成功标志
        // 将新消息追加到消息数组中
        message:state.message.concat({role:'assistant',content:'尝试'+tries+'次'}),
    }
}

/**
 * 构建工作流图（带循环逻辑）
 * 
 * 流程：
 * START -> attempt -> (判断 ok) -> [成功] -> done -> END
 *                      -> [失败] -> retry -> attempt (循环)
 * 
 * 使用条件边实现循环：
 * - ok 为 true 时，跳转到 done（然后结束）
 * - ok 为 false 时，跳转到 retry（然后回到 attempt 节点）
 */
const graph = new StateGraph(StateAnnotation)
    // 添加 attempt 节点
    .addNode("attempt",attempt)
    // 添加条件边：根据 attempt 返回的 ok 值决定下一步
    // 如果 ok 为 true，跳转到 "done"
    // 如果 ok 为 false，跳转到 "retry"
    .addConditionalEdges("attempt",(state)=>state.ok ? "done":"retry",{
        retry:"attempt",  // retry 指向 attempt，形成循环
        done:END,         // done 指向结束
    })
    // 编译图结构
    .compile();

/**
 * 获取图结构并生成 Mermaid 流程图
 */
const drawable = await graph.getGraphAsync();
// 生成 Mermaid 格式的图定义
const mermaid = drawable.drawMermaid();
// 打印 Mermaid 代码
console.log(mermaid);

// 执行工作流，传入初始状态 {tries: 0}
// 预期执行 3 次 attempt 节点后结束
console.log("result",await graph.invoke({tries:0}));
