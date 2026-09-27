import {
    Annotation, // 注释：定义工作流的状态值的描述，用于类型检查和状态管理
    END,        // 注释：结束节点，表示工作流的终点
    START,      // 注释：开始节点，表示工作流的起点
    StateGraph, // 注释：状态图类，用于构建有向图工作流
    MemorySaver, // 注释：内存保存器，用于保存和恢复工作流的状态
    Checkpointer, // 注释：检查点器，用于管理工作流的状态检查点
} from '@langchain/langgraph';

const StateAnnotation = Annotation.Root({
    //session 相关 会话 某人 访问次数
    visitCount:Annotation({
        reducer:(_prev,next)=>next,
        default:()=>0,
    }),
    message:Annotation({
        reducer:(_prev,next)=>next,
        default:()=>""
    })
})
// 计数的节点
function recordVist(state){
    const visitCount = state.visitCount + 1;
    const message = visitCount ===1 ? "这是你在本会话里第一次进入":`这是你在本会话里${visitCount}次进入`
    return {
        visitCount,
        message
    }
}

const graph = new StateGraph(StateAnnotation)
    .addNode("recordVisit",recordVist)
    .addEdge(START,"recordVisit")
    .addEdge("recordVisit",END)
const checkpointer = new MemorySaver();  //内存保存器
const app = graph.compile({
    checkpointer,
})
//多用户
const user1 = { configuration:{thread_id:"用户-小张"}};
const user2 = { configuration:{thread_id:"用户-小李"}};
const res1 = await app.invoke({},user1);
console.log(res1);
const res2 = await app.invoke({},user2);
console.log(res2);

