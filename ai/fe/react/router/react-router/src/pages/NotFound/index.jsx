import{
    useEffect
}from 'react';
import{
    useNavigate //路由跳转
}from 'react-router-dom'
const NotFound =()=>{
    let navigate= useNavigate();

    useEffect(()=>{
        setTimeout(()=>{
            window.location.href='/';
            navigate('/');
        },3000)
    })
    return(
        <>
        Not Found
        </>
    )
}
export default NotFound;