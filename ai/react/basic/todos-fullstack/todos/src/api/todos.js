// 一个模块，一个js文件
import Todos from '../pages/Todos';
import axios from './config';
//api 目录的职责 提供数据接口
//不是直接就去后端 后端可能没有开发好
export const getTodos =async()=>{
    const res = await axios.get('./todos');
    return res.data;
}
export default Todosl