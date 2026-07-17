import "dotenv/config"
import { Document } from "@langchain/core/documents"
import "cheerio"
/**
 * 掘金是 SPA 页面（客户端 JS 渲染），用 CheerioWebBaseLoader
 * 只能拿到空壳 HTML。正确做法是调用掘金后端 API 直接获取数据。
 */
const ARTICLE_ID = "7661924217857884186"

async function loadJuejinArticle(articleId) {
    const resp = await fetch("https://api.juejin.cn/content_api/v1/article/detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: articleId, client_type: 2608 }),
    })

    const { data } = await resp.json()
    const { article_info } = data

    // mark_content 是完整的 markdown 格式文章正文
    const pageContent = article_info.mark_content

    return new Document({
        pageContent,
        metadata: {
            source: `https://juejin.cn/post/${articleId}`,
            title: article_info.title,
            author: data.author_user_info?.user_name,
            ctime: article_info.ctime,
        },
    })
}

const documents = [await loadJuejinArticle(ARTICLE_ID)]
console.log(documents)