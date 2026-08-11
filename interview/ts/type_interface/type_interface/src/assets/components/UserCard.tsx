//接口，opp核心概念
//抽象
//原型式的 函数是一等对象
//ts 是大型企业级开发强类型语言，类java 传统的oop 思路
// class extends implements interface 
//面向接口的编程 父子组件数据接口
interface User{
    name:string;
    age:number;
    avatarUrl:string;
}
interface UserCardProps {
    user:User;
    onEdit:(id:number) => void;
}
const UserCard:React.FC<UserCardProps>=({user,onEdit})=>{

}
export default UserCard;