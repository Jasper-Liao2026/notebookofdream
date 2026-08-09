import {
    useState
} from 'react';
function RegisterFrom(){
    //非受控两次useRef
    //vue ref / reactive 两种响应式API
    const [from,setFrom] = useState({
        username:"",
        passward:""
    })
    const handleChange=(e)=>{
        setFrom({
            ...from,
            [e.target.name]:e.target.value
        })
    }
    return (
        <div>
            <input type="text" name='username' value={from.username}
            onChange={handleChange} placeholder='请输入用户名' />
            <input type="text" name='username' value={from.password}
            onChange={handleChange} placeholder='请输入密码' />
            <button type='submit' onClick={handleSubmit}>提交</button>
        </div>
    )
}