interface AddFn{
    (a:number,b:number):number
}
const add1:AddFn = (x,y) =>x+y
add1(1,2);
type AddType = (a:number,b:number) =>number