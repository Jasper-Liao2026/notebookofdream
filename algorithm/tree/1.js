function TreeNode(val){
    this.val=val
    this.left=this.right=null
}
const tree={
    val:'A',
    left:{
        val:'B',
        left:{
            val:'D',
            left:null,
            right:null
        },
        right:{
            val:'E',
            left:null,
            right:null
        }
    },
    right:{
        val:'C',
        left:{
            val:'f',
            left:null,
            right:null
        },
        right:{
            val:'G',
            left:null,
            right:null
        }
    }
}
//中序遍历
function preorder(root){
    //退出条件
    if(!root){
        return 
    }
    console.log(`当前遍历节点值是：`,root.val);
    preorder(root.left)
    preorder(root.right)
}
preorder(tree)


function postorder(root){
    if(!root){
        return
    }
    postorder(root.left)
    postorder(root.right)
    console.log(root.val)
}
postorder(tree)


//层序遍历
function levelOrder(root){
    const queue=[]
    const result=[]
    if(!root) return result
    queue.push(root);
    while(queue.length){
        const node=queue.shift();
        result.push(node.val)
        if(node.left) queue.push(node.left);
        if(node.right) queue.push(node.right);
    }
    return result
}

console.log(levelOrder(tree))