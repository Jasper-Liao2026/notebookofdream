import Redis from 'ioredis';
const redis = new Redis({
    host: 'localhost',
    port: 6380,
    db: 0,
});

redis.on('connect',()=>{
    console.log('链接成功');

})

redis.on('error',(err)=>{
    console.log('链接失败',err);
})

async function runRedisDemo(){
    // await redis.set('name','文强');
    // await redis.set('code','666666','EX',300)
    // console.log('String name:',await redis.get('name'))
    // await redis.quit()
    await redis.hset('user:1011','name','李四','age',28)
    
    console.log('Hash user:',await redis.hgetall('user:1011'))
}
runRedisDemo();