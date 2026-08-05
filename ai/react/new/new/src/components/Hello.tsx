// 1. 导入 React（提供 JSX 语法支持）
import * as React from 'react';

// 2. 定义 props 的类型约束（TypeScript 特有）
interface Props {
    userName: string;  // 这个组件需要一个"用户名"字符串
}

// 3. 定义组件：React.FC<Props> 表示"这是一个接收 Props 类型参数的函数组件"
const Hello: React.FC<Props> = (props) => {
    // 4. 返回 JSX —— 看起来像 HTML，其实是 JavaScript
    return (
        <h2>Hello World: {props.userName}</h2>
    );
};

// 5. 导出，让别的文件可以 import
export default Hello;
