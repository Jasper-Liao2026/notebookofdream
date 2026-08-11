interface Animal{
    name:string;

}
interface Animal{
    age:number;
}
const dog:Animal = {name:'人',age:2}
//接口属性可以分头多次约束，合并
type AnimalType = {name:string;}
type AnimalType = {age:number;}