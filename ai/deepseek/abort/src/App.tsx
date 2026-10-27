import{
  useState,
  useEffect
}from "react"
import './App.css'
function App(){
  //请求控制器，配给fetch 请求
  let controller = new AbortController()
  useEffect(()=>{
    fetch('/api/banners',{
      //配置请求控制器
      //signal:controller.signal
      signal: AbortSignal.timeout(1000)//信号，超时自动触发
    })
    .then(data=>data.json())
    .then(res=>console.log(res)) 
  },[])
    
  
  const stop = () =>{
    controller.abort("用户暂停")
  }
  return (
    <>
    <button onClick={stop}>暂停</button>
    </>
  )
}
export default App