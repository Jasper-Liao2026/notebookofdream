import{
  useRef,
  useState,
  useEffect
}from 'react';
function App(){
  console.log('main tread');
  // let worker= new Worker();
  //为组件的渲染 挂载让路
  //主线程
  //离开主线程？
    const workerRef = useRef(null); //可持久化的可变对象
    const [result,setResult] = useState(null); 
    const [loading,setLoading] = useState(false);
    useEffect(()=>{
      //开启一个线程 worker 开销比较大
      //ref 引用了worker线程
      const worker = new Worker(
        new URL("./work.js", import.meta.url)
      );
      workerRef.current = worker;
      // 监听worker 线程，有没有消息到达
      worker.onmessage = (e) => {
        console.log(e);
        const {result} = e.data;
        setResult(result);
        setLoading(false);
      };
      
      return ()=>{
        workerRef.current.terminate();
        workerRef.current = null;//手动回收
      }
    },[])
    //阻塞页面

    const startHeavyCalc=()=>{
      setLoading(true);
      //消息机制
      //给worker 线程发送一条工作指令
      workerRef.current.postMessage({
        num:88
      })
    }
    return(
      <div style={{padding:"30px"}}>
        <h2>useRef + WebWorker 耗时运算</h2>
        <p>开启web worker 线程 执行5亿次循环，结束后同时主线程</p>
        <button 
        onClick={startHeavyCalc}
        disabled={loading}
        >{loading?"正在后台计算....":"启动繁重计算任务"}</button>
        {result && <h3>计算结果:{result}</h3>}
      </div>
    )
}

export default App;
