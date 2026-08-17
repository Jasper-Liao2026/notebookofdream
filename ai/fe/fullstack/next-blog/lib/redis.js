//node redis 客户端 ，驱动
import Redis from 'ioredis';
const redis= new Redis();//默认 NOSQL
//hash key 字符串id，值 note 的序列化字符串
//redis key:value value 特别支持hash类型
const initialData = {
  "1702459181837": '{"title":"sunt aut","content":"quia et suscipit suscipit recusandae","updateTime":"2023-12-13T09:19:48.837Z"}',
  "1702459182837": '{"title":"qui est","content":"est rerum tempore vitae sequi sint","updateTime":"2023-12-13T09:19:48.837Z"}',
  "1702459188837": '{"title":"ea molestias","content":"et iusto sed quo iure","updateTime":"2023-12-13T09:19:48.837Z"}'
}
export async function getAllNotes(){
    const data = await redis.hgetall('notes');//获取所有键值对
    if(Object.keys(data).length==0){//判断是否为空
        await redis.hmset('notes',initialData);//为空就存进去
    }
    return await redis.hgetall('notes');
}