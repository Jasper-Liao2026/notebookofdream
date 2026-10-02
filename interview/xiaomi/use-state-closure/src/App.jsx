import {useState,useEffect} from 'react';


const App = ()=>{
  const [count,setCount] = useState(0);
  useEffect(()=>{
    //闭包 函数嵌套函数
    //函数的申明相关的
    //只申明一次，回调函数执行多少次
    const timer = setInterval(()=>{
      setCount(count + 1);
    },1000)
    return ()=>clearInterval(timer);
  },[])


  return <div>Count:{count}</div>
}

export default App;