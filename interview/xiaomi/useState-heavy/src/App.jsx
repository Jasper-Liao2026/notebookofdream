import { useState } from 'react';

// 昂贵计算函数
function heavyCalc() {
  console.log('🔥 执行昂贵计算');
  // 模拟大数据循环/复杂运算
  let sum = 0;
  for(let i = 0; i < 1000000; i++) sum += i;
  return sum;
}

export default function App() {
  // ✅ 惰性初始化：传入函数，仅挂载时运行一次
  const [value, setValue] = useState(() => heavyCalc());

  // 普通写法 ❌ 每次组件重渲染都会调用 heavyCalc()
  // const [value, setValue] = useState(heavyCalc());

  console.log('组件渲染');

  return (
    <div>
      <p>结果：{value}</p>
      {/* 点击会触发组件重渲染，不会再执行 heavyCalc */}
      <button onClick={() => setValue(v => v + 1)}>点我更新state</button>
    </div>
  );
}