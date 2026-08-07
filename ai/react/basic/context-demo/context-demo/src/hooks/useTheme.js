// react 全面hooks编程，可以使用react,react-router-dom 等提供的hooks
// 还可以自定义hook use 开头函数，自己封装的
// 函数的封装，多的地方是可以将react的响应式业务封装进去
// 在Provider 里面任何层级的组件 多个地方消费数据，模块化抽离放到hooks
import { ThemeContext } from '../ThemeContext';
import { useContext } from 'react';
// 约定use开头
export function useTheme() {
    return useContext(ThemeContext);
}
