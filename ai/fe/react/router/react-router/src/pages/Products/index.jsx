import{
    Outlet
} from 'react-router-dom'

const Products =()=>{
    return(
        <>
        <h1>产品列表</h1>
        <Outlet />//outlet 组件，二级路由的出口，二级路由的内容会显示在这里
        </>
    )
}
export default Products