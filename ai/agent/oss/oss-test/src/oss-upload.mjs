import 'dotenv/config'
import OSS from 'ali-oss'
import fs from 'fs'

// 先检查配置：缺哪一项就直接提示，避免 ali-oss 抛出难懂的 require accessKeyId
const required = ['OSS_REGION', 'OSS_ACCESS_KEY_ID', 'OSS_ACCESS_KEY_SECRET', 'OSS_BUCKET']
const missing = required.filter((key) => !process.env[key])
if (missing.length) {
    console.error(`缺少环境变量：${missing.join('、')}，请在 oss-test/.env 中填写后重试`)
    process.exit(1)
}

const client = new OSS({
    region: process.env.OSS_REGION,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    authorizationV4: true,
    bucket: process.env.OSS_BUCKET,
})

async function putStream() {
    try {
        const stream = fs.createReadStream('./聚万邦.png')
        // 第二个参数是完整的对象 key，必须带文件名；只给目录会生成一个 0 字节的空对象
        const result = await client.putStream('aaa/bbb/聚万邦.png', stream)
        console.log('上传成功:', result.name)
        console.log('访问地址:', result.url)
    } catch (e) {
        console.log('上传失败:', e.code, e.message)
    }
}

await putStream()
