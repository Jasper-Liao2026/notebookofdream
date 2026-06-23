function dfs(root,res=[]){
    if(!root) return res
    res.push(root.val)
    dfs(root.left,res)
    dfs(root.right,res)
    return res
}