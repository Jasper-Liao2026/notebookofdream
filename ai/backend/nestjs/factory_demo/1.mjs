class IceCream{
    constructor(){
        this.name = '冰激凌'
        this.price = 3
    }
    show(){
        console.log(`名称：${this.name}，价格：${this.price}`)
    }
}
class LemonTea{
    constructor(){
        this.name = '柠檬茶'
        this.price = 4
    }
    show(){
        console.log(`名称：${this.name}，价格：${this.price}`)
    }
}

class MilkTea{
    constructor(){
        this.name = '奶茶'
        this.price = 8
    }
    show(){
        console.log(`名称：${this.name}，价格：${this.price}`)
    }
}

//工厂类
class MixueFactory{
    static create(type){
        switch(type){
            case 'ice':
                return new IceCream()
            case 'lemon':
                return new LemonTea()
            case 'milk':
                return new MilkTea()
        }
    }
}
//管理并返回冰激凌这个类
const drink1 = MixueFactory.create('ice');
drink1.show();
const drink2 = MixueFactory.create('lemon');
drink2.show();