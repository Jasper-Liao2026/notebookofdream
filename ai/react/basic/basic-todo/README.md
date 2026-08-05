# todos
## 开发流程和思路

## 前端本地存储
- 浏览器 有区间 存内容
    - 浏览器缓存静态资源
    - localStorage key:value 配置、关键数据 5M 左右
    - setItem(key,字符串 JSON.stringify(obj))
    - getItem(key)
    - 前端也有类Mysql 数据库  存更多数据
    IndexDB  

## useEffect
- 生命周期
    - 挂载后mounted
    []
    - 挂载及更新后
    [todos] 
    - 挂载，任何项更新都执行
    第二个参数不传
    
- useEffect 卸载前的副作用
组件完整生命周期，willunmount
return () => { }
定时器，移除
内存泄漏 这个内存永远无法回收