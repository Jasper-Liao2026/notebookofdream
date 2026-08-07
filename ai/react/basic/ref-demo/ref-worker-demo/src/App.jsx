import{
  useRef,
  useState,
  useEffect
}from 'react';
function App(){
  // let worker= new Worker();
  //为组件的渲染 挂载让路
  //主线程
  //离开主线程？
    const workerRef = useRef(null); //可持久化的可变对象
    
    useEffect(()=>{
      //开启一个线程
      //ref 引用了worker线程
      const worker = new Worker(
        new URL("./work.js", import.meta.url)
      );
      // 主线程接收 Worker 发来的消息
      worker.onmessage = (e) => {
        console.log('主线程收到:', e.data);
      };
      workerRef.current = worker;
    },[])
    //阻塞页面
    return(
      <>
      </>
    )
}

export default App;
