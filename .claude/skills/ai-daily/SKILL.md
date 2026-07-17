---
name: ai-daily
description: 生成"甜甜AI日报"——抓取近24小时 AI 行业重要新闻（TechCrunch、The Verge、Hacker News、Reddit），精选不超过5条，生成中文摘要与关键词标签，输出卡片式精美 HTML 页面。当用户提到 AI日报、每日AI新闻、AI资讯、甜甜AI日报、今天AI圈有什么新闻、AI news digest、AI daily 或任何"帮我汇总/整理最新 AI 新闻"的请求时，务必使用此 skill，即使用户没有明确说"日报"两个字。
---

# 甜甜AI日报

抓取近 24 小时 AI 领域重要新闻，精选、翻译、摘要后生成一份卡片式 HTML 日报。

## 工作流程

### 第一步：确认保存位置

先询问用户本期日报 HTML 文件保存到哪里（例如桌面、某个项目文件夹）。文件命名为 `AI日报-YYYY-MM-DD.html`。如果用户在请求中已经指明位置，则不必再问。

### 第二步：抓取资讯

用 `curl` 并行抓取以下来源（同一轮消息中发出所有请求，节省时间）。注意：本环境中 WebFetch 对这些域名会被安全策略拦截，直接用 Bash + curl 才可靠：

| 来源 | 抓取命令 |
|------|----------|
| TechCrunch AI | `curl -s -m 30 -A "Mozilla/5.0" "https://techcrunch.com/category/artificial-intelligence/feed/" -o /tmp/tc.xml`（RSS） |
| The Verge AI | `curl -s -m 30 -A "Mozilla/5.0" "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml" -o /tmp/verge.xml`（RSS） |
| Hacker News | `curl -s -m 30 "https://hn.algolia.com/api/v1/search?query=AI&tags=story&numericFilters=created_at_i%3E{24小时前Unix时间戳},points%3E50" -o /tmp/hn.json`（先用 `date -d '24 hours ago' +%s` 算时间戳；注意 `>` 要 URL 编码为 `%3E`） |
| Reddit | `curl -s -m 30 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "https://www.reddit.com/r/artificial/top.json?t=day&limit=15" -o /tmp/reddit.json`（此源在本环境常超时，失败即跳过） |

下载后用 Python 解析 RSS/JSON，提取：标题、发布时间、原文链接、内容概要。Windows 环境注意两点：

- Python 看不到 git-bash 的 `/tmp` 虚拟路径，需先用 `cygpath -w /tmp/xx.xml` 转成 Windows 路径再传给 Python
- 控制台默认 GBK 编码会导致打印崩溃，运行时加 `PYTHONIOENCODING=utf-8`

**容错原则**：任何来源抓取失败（超时、被墙、返回错误）直接跳过，不要反复重试，也不要让单个来源阻塞整个流程。只要有 2 个以上来源成功即可继续；若几乎全部失败，改用 WebSearch 搜索"AI news today"补充素材，并在最终告知用户哪些来源不可用。

### 第三步：过滤与精选

从所有抓到的条目中精选**不超过 5 条**。取舍标准：

- **只保留 24 小时内**发布的内容（RSS 的 pubDate、HN/Reddit 的时间戳可判断）
- **优先级从高到低**：重大模型/产品发布 > 行业重要动向（融资、收购、政策监管） > 有影响力的研究突破 > 高热度社区讨论
- **过滤掉**：营销软文、旧闻翻炒、纯观点评论、与 AI 无关的泛科技新闻
- **跨源去重**：同一事件被多家报道时只保留一条，优先选信息最全的原始报道

宁缺毋滥——如果当天真正值得看的新闻只有 3 条，就输出 3 条，不要凑数。

### 第四步：生成中文摘要与标签

对每条精选资讯：

- **标题**：翻译为自然流畅的中文标题（不是逐字直译）
- **摘要**：50-100 字中文核心要点。写清"谁做了什么、有什么影响"，砍掉背景铺垫和记者式修辞。摘要必须基于抓取到的实际内容，不可脑补细节
- **标签**：2-4 个关键词标签，如 `大模型`、`OpenAI`、`融资`、`开源`、`监管`、`芯片`，方便读者快速定位兴趣点
- **来源与时间**：标注来源媒体名称和发布时间

### 第五步：生成 HTML 页面

读取本 skill 目录下的 `assets/template.html` 作为页面模板，将其中的占位符替换后写入目标文件：

- `{{DATE}}` → 当天日期，格式 `YYYY年M月D日`
- `{{CARDS}}` → 所有资讯卡片的 HTML（卡片结构见模板内注释）

关键要求：

- 每张卡片整体是一个 `<a>` 链接，点击直接在新标签页打开原文
- 卡片包含：中文标题、摘要、标签、来源+时间
- 保持模板的现代简约风格，不要额外堆砌装饰

生成后告知用户文件完整路径，并用 `cmd.exe /c start "" "<Windows格式文件路径>"` 在默认浏览器中打开预览（`explorer.exe` 会误报失败，用 cmd start 更可靠）。

## 质量原则

- **真实性第一**：每条摘要都必须能对应到抓取的原文内容。链接必须是抓取到的真实 URL，绝不编造或猜测链接。
- **中文读者视角**：摘要面向中文读者，公司名保留英文（OpenAI、Anthropic），产品术语按习惯处理（如 "large language model" → 大模型）。
- **少即是多**：这份日报的价值在于替读者做减法。5 条以内、每条 50-100 字，让人 2 分钟读完当天最重要的事。
