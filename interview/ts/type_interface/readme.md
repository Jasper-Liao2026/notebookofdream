# TS 必考题之type & interface的区别
- interface 的开发用法
- 共同点 
    interface 和 type 都可以描述对象的结构
    用于函数参数、返回值
    给对象、变量做类型约束

    interface User{
        name:string;
        age:number;
        avatarUrl:string;
    }
    type UserType = {
        name:string;
        age:number;
        avatarUrl:string;
    }

## 区别
- 继承
- 接口属性可以分头多次约束，合并
    type不能重复声明
- 能否表示非对象类型
    简单数据的类型别名
- 函数类型的区别
    都可以表达，有些区别，type更方便