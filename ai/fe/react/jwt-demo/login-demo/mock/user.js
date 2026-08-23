export default [
    {
        url:'/api/login',
        method:'POST',
        timeout:2000,
        response:(req,res)=>{
            const body = req.body;
            console.log(body);
            return {
                code:0, //未有错误
                user:{
                    username:'牛牛'
                },
                token:'123456'

            }
        }
    }
]