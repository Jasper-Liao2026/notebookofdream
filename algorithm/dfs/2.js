//递归升级版
function dfsPreOrderIter(root){
    if(!root) return []
    const res=[];
    const stack=[root]
    while(stack.length){
        const node=stack.pop()
        res.push(node.val);
        //LIFO
        if(node.right) stack.push(node.right)
        if(node.left) stack.push(node.left)
    }
    return res;
}