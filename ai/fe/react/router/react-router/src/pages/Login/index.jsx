import{
    // 代码里重定向
    // Navigate组件 配置的时候
    useNavigate,
    useLocation
}from 'react-router-dom';


const Login=()=>{
    const navigate = useNavigate();
    const location = useLocation();

    // 可选连运算符 es11
    const from = location.state?.from || "/";
    function handleSubmit(e){
        e.preventDefault();//阻止默认提交
        const formData = new FormData(e.currentTarget);
        const username = formData.get('username');
        const password = formData.get('password');
        if(!username || !password){
            alert('?');
        }
        if(username ==='admin' && password ==='123456'){
            localStorage.setItem('isLogin','true');
            //navigate(from)
            //浏览器访问留下历史记录的history 栈
            //登录成功后，如果还能返回登录页面，用户就会蒙，把用户当小白，
            // replace在跳转到新页面的同时，将新页面历史记录替换掉
            navigate(from,{replace:true});
        }else{
            alert('用户名或密码错误');
        }
    }
    return (
        <form onSubmit={handleSubmit}>
        <h1>登录</h1>
        <input name='username' placeholder='请输入用户名' required/>
        <input name='password' placeholder='请输入密码' required/>
        <button type="submit">登录</button>
        </form>
    )
}

export default Login;