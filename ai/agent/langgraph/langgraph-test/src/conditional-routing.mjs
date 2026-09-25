import {
    Annotation, // 注释：定义工作流的状态值的描述，用于类型检查和状态管理
    END,        // 注释：结束节点，表示工作流的终点
    START,      // 注释：开始节点，表示工作流的起点
    StateGraph, // 注释：状态图类，用于构建有向图工作流
} from '@langchain/langgraph';

/*
 * StateAnnotation：定义工作流的状态结构
 * 每个字段都有一个 Annotation，用于描述：
 * - default: 初始值
 * - reducer: 状态更新函数，合并多个状态更新
 */
const StateAnnotation = Annotation.Root({
    // query：用户输入的查询/问题
    query:Annotation({
        default:()=>"",  // 初始为空字符串
        reducer:(_prev,next)=>next,  // 直接替换旧值
    }),
    // route：路由决策，决定下一步走哪个节点
    route:Annotation({
        reducer:(_prev,next)=>next,
        default:()=>"chat",  // 默认路由到 chat 节点
    }),
    // answer：最终返回的答案
    answer:Annotation({
        reducer:(_prev,next)=>next,
        default:()=>"",  // 初始为空字符串
    })
})

/*
 * router：路由节点
 * 根据用户查询的内容决定后续路由：
 * - 如果包含数学运算符(+-*)，认为是数学问题，路由到 math
 * - 否则路由到 chat
 */
const router = (state) =>{
    // 正则检测是否包含数学运算符
    const isMath = /[+\-*]/.test(state.query);
    // 返回路由决策，写入 route 字段
    return {
        route:isMath?"math":"chat",
    }
}

/*
 * mathNode：数学计算节点
 * 使用 eval 计算数学表达式（注意：实际项目中 eval 有安全风险）
 */
const mathNode = (state) =>{
    try{
        // 将计算结果转换为字符串
        return {answer:String(eval(state.query))}
    }catch{
        // 计算失败时返回错误信息
        return {answer:"表达式无法计算"}
    }
}

/*
 * chatNode：聊天节点
 * 对用户输入进行简单回复
 */
const chatNode = (state) =>({answer:`你说的是${state.query}`});

/*
 * 构建状态图
 * 流程：START -> router -> (math/chat) -> END
 */
const graph = new StateGraph(StateAnnotation)
    .addNode("router",router)  // 添加路由节点
    .addNode("math",mathNode)  // 添加数学计算节点
    .addNode("chat",chatNode)  // 添加聊天节点
    .addEdge(START,"router")   // 从开始节点指向路由节点（固定流程）
    // 条件跳转：根据 router 返回的 route 值决定下一步
    .addConditionalEdges("router",(state)=>state.route,{
        math:"math",   // route 为 math 时跳转到 math 节点
        chat:"chat",   // route 为 chat 时跳转到 chat 节点
    })
    .addEdge("math",END)   // math 节点执行完后结束
    .addEdge("chat",END)   // chat 节点执行完后结束
    .compile()             // 编译图结构
    
// 获取编译后的图结构（异步）
const drawable = await graph.getGraphAsync();
// 生成 Mermaid 格式的图定义
const mermaid = drawable.drawMermaid({withStyles:true});
// 打印 Mermaid 代码，可用于可视化
console.log(mermaid);
//langchain langgraph 共享底层相同基础设施 llm
// 执行工作流，传入初始状态 {query: "你好"}
console.log("result",await graph.invoke({query:"你好"}));