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
    const u1:User = {
        name:'张三',
        age:18,
        avatarUrl:
    }  

    interface Person{
        name:string;
    }

    interface Employee extends Person{
        job:string;
    }
    type PersonType ={name:string}
    type EmployeeType = PersonType & {job:string}
    const e1:Employee = {name:'人',job:'人'}
    const e2:EmployeeType = {name:'人',job:'人'}
