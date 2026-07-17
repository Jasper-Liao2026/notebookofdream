// 网页爬虫，并解析其中的指定部分，CSS选择器
import axios from 'axios'        // 标准http请求库
import * as cheerio from 'cheerio'

// 向URL发送HTTP请求 → 拿到HTML字符串 → cheerio解析为DOM树 → CSS选择器提取内容
// HTML字符串 -> DOM树状结构 -> CSS Selector -> 树的遍历 -> 节点返回
// cheerio让JS开发者以前端思维(jQuery)高效完成指定URL指定部分的爬取工作，不需要用正则

const targetUrl = 'https://juejin.cn/post/7660707431753678854'

async function crawlPage() {
    try {
        // 1. axios 发送HTTP请求，拿到HTML字符串
        const { data: html } = await axios.get(targetUrl)
        console.log('=== HTML字符串长度:', html.length)

        // 2. cheerio.load() 在内存中把HTML字符串虚拟化成DOM对象（树状结构）
        const $ = cheerio.load(html)

        // 3. CSS选择器在DOM树里查找，.text()提取文本内容
        const pageContent = $('.main-area p').text()
        console.log('=== 提取的正文:\n', pageContent)

    } catch (e) {
        console.error('出错:', e.message)
    }
}

crawlPage()