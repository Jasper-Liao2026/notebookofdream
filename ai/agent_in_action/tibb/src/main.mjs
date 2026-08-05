// 让 dotenv 在程序启动时自动读取项目根目录下的 .env，
// 并把其中的配置写入 process.env，供后面的模型和 Milvus 客户端使用。
import "dotenv/config";

// 导入 Node.js 的路径解析函数，用来从 EPUB 文件路径中提取不带扩展名的书名。
import { parse } from "path";

// 导入 Milvus Node.js SDK 中本项目需要的类型和客户端。
import {
    MilvusClient, // Milvus 客户端：负责连接数据库、建集合、建索引、加载集合和写入数据。
    DataType,     // Milvus 字段类型枚举，例如 VarChar、Int32、FloatVector。
    MetricType,   // 向量相似度类型枚举，本项目使用 COSINE（余弦相似度）。
    IndexType     // 向量索引类型枚举，本项目使用 IVF_FLAT。
} from "@zilliz/milvus2-sdk-node";

// 导入 LangChain 对 OpenAI 兼容 Embedding 接口的封装。
// Embedding 模型负责把文本转换成可以用于相似度检索的数字向量。
import {
    OpenAIEmbeddings
} from "@langchain/openai";

// 导入 EPUB 文档加载器。
// 它负责解析 EPUB，并把 EPUB 中的 HTML 内容转换成 LangChain Document。
import {
    EPubLoader
} from "@langchain/community/document_loaders/fs/epub";

// 导入递归字符文本分块器。
// 它负责把一章较长的正文拆成多个适合生成 Embedding 的小片段。
import {
    RecursiveCharacterTextSplitter
} from "@langchain/textsplitters";

// Milvus 集合名称；可以近似理解为关系型数据库中的“表名”。
const COLLECTION_NAME = "ebook";

// 每条文本向量的维度。
// 此值必须同时匹配 Embedding 模型的输出维度和 Milvus vector 字段的维度。
const VECTOR_DIM = 1024;

// 每个文本片段的目标最大长度。
// RecursiveCharacterTextSplitter 默认用 JavaScript 字符串长度计算，不是按 Token 计算。
const CHUNK_SIZE = 500;

// 要处理的 EPUB 文件路径。
// 这是相对路径，因此通常需要在项目根目录执行 `node src/main.mjs`。
const EPUB_FILE = "./天龙八部.epub";

// 从环境变量读取 Milvus 服务地址。
const ADDRESS = process.env.MILVUS_ADDRESS;

// 从环境变量读取 Milvus/Zilliz 的鉴权令牌。
const TOKEN = process.env.MILVUS_TOKEN;

// parse(EPUB_FILE) 会解析文件路径；name 是不含扩展名的文件名。
// 例如 "./天龙八部.epub" 会得到 BOOK_NAME === "天龙八部"。
const { name: BOOK_NAME } = parse(EPUB_FILE);

// 初始化 Embedding 客户端，后续所有正文片段都通过它转换成向量。
const embeddings = new OpenAIEmbeddings({
    // 调用 OpenAI 兼容服务所使用的 API Key。
    apiKey: process.env.OPENAI_API_KEY,

    // Embedding 模型名称，例如环境变量中配置的某个文本向量模型。
    model: process.env.EMBEDDING_MODEL_NAME,

    // configuration 会传给底层 OpenAI 客户端。
    configuration: {
        // 自定义 OpenAI 兼容接口的基础地址；可以是官方地址，也可以是兼容服务商地址。
        baseURL: process.env.OPENAI_BASE_URL,
    },

    // 请求模型返回 1024 维向量；所选模型必须支持这个维度参数。
    dimensions: VECTOR_DIM
});

// 初始化 Milvus 客户端。
// 创建对象时保存连接配置，真正建立连接会在 main() 中等待 connectPromise。
const client = new MilvusClient({
    // Milvus 服务地址。
    address: ADDRESS,

    // Milvus/Zilliz 鉴权令牌。
    token: TOKEN,
});

/**
 * 把一段文本转换成 Embedding 向量。
 *
 * @param {string} text 要向量化的文本。
 * @returns {Promise<number[]>} 长度应为 VECTOR_DIM（1024）的数字数组。
 */
async function getEmbedding(text) {
    // embedQuery 会向配置好的 Embedding API 发起请求并等待向量结果。
    // 虽然方法名是 embedQuery，这里既被正文片段使用，也可以被查询问题使用。
    const result = await embeddings.embedQuery(text);

    // 把模型返回的向量交给调用方。
    return result;
}

/**
 * 确保 Milvus 中存在 ebook 集合、向量索引，并把集合加载到可查询状态。
 *
 * @param {string|number} bookId 当前书籍 ID。
 *        注意：这个参数在当前函数体中没有实际使用，只是调用方传了进来。
 * @returns {Promise<void>}
 */
async function ensureCollection(bookId) {
    try {
        // 查询名为 ebook 的集合是否已经存在，避免每次运行都重复建集合。
        const hasCollection = await client.hasCollection({
            // 指定要检查的集合名称。
            collection_name: COLLECTION_NAME
        });

        // 打印 Milvus 返回的布尔值，便于观察集合是否已经存在。
        console.log(hasCollection.value);

        // 只有集合不存在时，才创建集合及其向量索引。
        if (!hasCollection.value) {
            // 输出当前执行阶段。
            console.log("创建集合...");

            // 在 Milvus 中创建 ebook 集合，并一次性声明所有字段结构。
            await client.createCollection({
                // 新集合的名称。
                collection_name: COLLECTION_NAME,

                // fields 定义每条 Milvus 记录包含哪些字段。
                fields: [
                    {
                        // 每个文本片段的唯一 ID，例如 "1_12_3"。
                        name: "id",

                        // ID 采用可变长度字符串类型。
                        data_type: DataType.VarChar,

                        // ID 最多允许 100 个字符。
                        max_length: 100,

                        // 把 id 声明为集合主键；主键值必须唯一。
                        is_primary_key: true
                    },
                    {
                        // 书籍 ID；为将来在同一集合存多本书预留。
                        name: "book_id",

                        // 数据库字段声明为字符串。
                        // 当前 main() 传入的是数字 1，实际项目最好统一传字符串 "1"。
                        data_type: DataType.VarChar,

                        // 书籍 ID 最多允许 100 个字符。
                        max_length: 100
                    },
                    {
                        // 书名，例如“天龙八部”。
                        name: "book_name",

                        // 书名使用可变长度字符串保存。
                        data_type: DataType.VarChar,

                        // 书名最多允许 200 个字符。
                        max_length: 200
                    },
                    {
                        // 当前 EPUB Document 在 documents 数组中的顺序，从 1 开始。
                        // 它不一定等同于小说实际的“第几回”。
                        name: "chapter_num",

                        // 章节顺序使用 32 位整数保存。
                        data_type: DataType.Int32,
                    },
                    {
                        // 当前文本片段在所属 EPUB Document 中的顺序，从 0 开始。
                        name: "index",

                        // 分块序号使用 32 位整数保存。
                        data_type: DataType.Int32
                    },
                    {
                        // 保存文本片段原文；RAG 检索后需要把它交给聊天模型。
                        name: "content",

                        // 原文使用可变长度字符串保存。
                        data_type: DataType.VarChar,

                        // 单条原文最多允许 10000 个字符；当前 chunkSize=500，留有充足余量。
                        max_length: 10000
                    },
                    {
                        // 保存 content 对应的 Embedding 向量。
                        name: "vector",

                        // 使用浮点向量字段，使 Milvus 能执行向量相似度检索。
                        data_type: DataType.FloatVector,

                        // 向量字段固定为 1024 维，必须和 Embedding 输出一致。
                        dim: VECTOR_DIM
                    }
                ]
            });

            // 到这里表示 Milvus 已经成功创建集合。
            console.log("集合创建成功");

            // 提示下一步开始创建向量索引。
            console.log("创建索引");

            // 为 vector 字段创建索引，加速之后的相似度搜索。
            await client.createIndex({
                // 索引所属的集合。
                collection_name: COLLECTION_NAME,

                // 要建立索引的字段。
                field_name: "vector",

                // IVF_FLAT 会先把向量划分到不同的聚类桶中，搜索时减少候选范围。
                index_type: IndexType.IVF_FLAT,

                // 使用余弦相似度比较两个向量的语义方向。
                metric_type: MetricType.COSINE,

                // nlist 表示 IVF 索引划分的聚类数量。
                // 1024 是演示值，真实项目应根据向量数量和召回率测试调整。
                params: { nlist: 1024 },
            });

            // 到这里表示索引创建请求已经成功完成。
            console.log("索引创建成功");
        }

        try {
            // 把集合加载到 Milvus 查询节点，使后续 search 可以使用它。
            // 即使集合原本已存在，每次启动程序仍然需要确认它处于加载状态。
            await client.loadCollection({
                // 指定要加载的集合。
                collection_name: COLLECTION_NAME
            });

            // 输出集合加载成功信息。
            console.log("集合加载成功");
        } catch (err) {
            // 当前代码把任何 loadCollection 异常都解释为“已经加载”。
            // 实际项目最好判断具体错误类型，避免掩盖网络或权限错误。
            console.error("集合已经处于加载状态");
        }
    } catch (err) {
        // 捕获检查集合、建集合或建索引阶段的异常并输出完整错误对象。
        // 当前函数没有继续 throw，因此调用方仍可能继续执行后面的 EPUB 处理。
        console.error("创建集合时出错", err);
    }
}

/**
 * 加载 EPUB，逐个处理 EPUB Document，并把所有文本片段写入 Milvus。
 *
 * 名称中虽然有 Streaming，但 loader.load() 会先把全部 Document 读入内存；
 * 真正逐个执行的是后面的 Document 处理循环，并非严格意义上的文件流式读取。
 *
 * @param {string|number} bookId 当前书籍 ID，会写入每一条 Milvus 记录。
 * @returns {Promise<number|undefined>} 成功时返回插入条数，失败时返回 undefined。
 */
async function loadAndProcessEPubStreaming(bookId) {
    try {
        // 输出即将读取的 EPUB 文件路径。
        console.log(`\n 开始加载EPUB文件：${EPUB_FILE}`);

        // 创建 EPUB 加载器实例。
        const loader = new EPubLoader(EPUB_FILE, {
            // true 表示按 EPUB 内部内容单元生成多个 Document，
            // 而不是把整本 EPUB 合并成一个超长 Document。
            splitChapters: true
        });

        // 解析整本 EPUB，并等待所有 LangChain Document 加载完成。
        const documents = await loader.load();

        // 打印 Loader 生成的 Document 数量。
        // 这个数量是 EPUB 内容单元数量，不一定是小说真实章节数量。
        console.log(`加载完成，共${documents.length}个章节`);

        // 创建递归字符分块器，后面所有 Document 都复用同一个实例。
        const textSplitters = new RecursiveCharacterTextSplitter({
            // 每个 chunk 的目标最大字符串长度为 500。
            chunkSize: CHUNK_SIZE,

            // 相邻 chunk 尽量保留约 50 个字符的重叠，避免语义在切分边界断裂。
            chunkOverlap: 50,
        });

        // 累计整本 EPUB 成功写入 Milvus 的记录数。
        let totalInserted = 0;

        // 保存 Document 总数，避免在日志模板中反复读取 documents.length。
        const documentLen = documents.length;

        // 按 EPUB Document 顺序逐个处理，chapterIndex 从 0 开始。
        for (
            let chapterIndex = 0;              // 初始化：从第 0 个 Document 开始。
            chapterIndex < documents.length;   // 条件：没有处理完全部 Document 时继续。
            chapterIndex++                     // 递增：处理下一个 Document。
        ) {
            // 取得当前正在处理的 LangChain Document。
            const chapter = documents[chapterIndex];

            // pageContent 是 EPubLoader 从 HTML 中提取出的纯文本正文。
            const chapterContent = chapter.pageContent;

            // 向终端显示当前进度；对用户显示时把数组下标加 1。
            console.log(`处理第${chapterIndex + 1}/ ${documentLen} 章...`);

            // 按 500 字符、50 字符重叠的规则拆分当前 Document，并等待结果。
            const chunks = await textSplitters.splitText(chapterContent);

            // 打印当前 Document 被拆成了多少个文本片段。
            console.log(`拆分为${chunks.length}个片段`);

            // 如果当前 Document 没有可用文本，则不调用 Embedding API，也不写数据库。
            if (chunks.length === 0) {
                // 输出跳过原因。
                console.log("跳过空章节\n");

                // 结束本轮循环，直接处理下一个 Document。
                continue;
            }

            // 提示即将进入最耗时的 Embedding 和数据库写入阶段。
            console.log("生成向量并插入中...");

            // 为当前 Document 的所有 chunk 生成向量并批量插入 Milvus。
            const insertedCount = await insertChunksBatch(
                chunks,           // 当前 Document 的全部文本片段。
                bookId,           // 当前书籍 ID。
                chapterIndex + 1  // 当前 EPUB Document 顺序；存储时从 1 开始。
            );

            // 把本批成功插入的记录数累加到全书总数。
            totalInserted += insertedCount;

            // 输出当前 Document 的写入结果。
            console.log(`已插入${insertedCount}条记录`);
        }

        // 所有 Document 处理完成后，打印整本 EPUB 的总插入条数。
        console.log(`\n总共插入${totalInserted}条记录\n`);

        // 将总插入数返回给调用方；当前 main() 没有继续使用这个返回值。
        return totalInserted;
    } catch (err) {
        // 捕获 EPUB 加载、分块、Embedding 或插入阶段向上抛出的异常。
        // 当前代码只记录错误，没有继续 throw，所以调用方不会收到失败状态。
        console.error("加载EPUB时出错", err);
    }
}

/**
 * 将一个 EPUB Document 拆出的全部 chunk 转为向量，并批量插入 Milvus。
 *
 * @param {string[]} chunks 当前 Document 的文本片段数组。
 * @param {string|number} bookId 书籍 ID。
 * @param {number} chapterNum 当前 EPUB Document 的顺序编号。
 * @returns {Promise<number>} Milvus 报告的成功插入记录数。
 */
async function insertChunksBatch(chunks, bookId, chapterNum) {
    try {
        // 防御性判断：没有文本片段时不请求模型、不访问数据库，直接返回 0。
        if (chunks.length === 0) {
            // 保证函数成功时始终返回数字，便于调用方做累加。
            return 0;
        }

        // 把每个文本 chunk 转换为一条完整的 Milvus 记录。
        // Promise.all 会并发等待当前 Document 内所有 Embedding 请求完成；
        // 其中任意一个请求失败，整个 Promise.all 都会失败并进入 catch。
        const insertData = await Promise.all(
            chunks.map(async (chunk, chunkIndex) => {
                // 为当前文本片段调用 Embedding API，生成 1024 维向量。
                const vector = await getEmbedding(chunk);

                // 返回即将写入 Milvus 的单条记录。
                return {
                    // 使用“书籍ID_章节顺序_分块顺序”构造唯一主键。
                    id: `${bookId}_${chapterNum}_${chunkIndex}`,

                    // 保存书籍 ID，便于以后按书过滤；当前传入值是数字 1。
                    book_id: bookId,

                    // 保存从 EPUB 文件名中解析出的书名“天龙八部”。
                    book_name: BOOK_NAME,

                    // 保存当前 EPUB Document 的顺序编号，从 1 开始。
                    chapter_num: chapterNum,

                    // 保存 chunk 在当前 Document 内的数组下标，从 0 开始。
                    index: chunkIndex,

                    // 保存原始文本，检索命中后会把它作为 RAG 上下文。
                    content: chunk,

                    // 保存与 content 对应的 1024 维语义向量。
                    vector: vector,
                };
            })
        );

        // 将当前 Document 的所有记录作为一个数组批量写入 Milvus。
        const insertResult = await client.insert({
            // 指定目标集合。
            collection_name: COLLECTION_NAME,

            // data 中的每个对象对应 Milvus 中的一条记录。
            data: insertData,
        });

        // Milvus 的 insert_cnt 可能是字符串或数字，因此先用 Number 统一转换。
        // 如果结果缺失或无法转换，就回退为 0，保证调用方拿到稳定的数字类型。
        return Number(insertResult.insert_cnt) || 0;
    } catch (err) {
        // 输出出错的 EPUB Document 编号和简化后的错误信息。
        console.error(`插入章节${chapterNum}的数据时出错:`, err.message);

        // 继续向上抛出，让 loadAndProcessEPubStreaming() 知道整批处理失败。
        throw err;
    }
}

/**
 * 程序总入口：连接 Milvus、准备集合，然后导入整本 EPUB。
 */
const main = async () => {
    try {
        // 打印 80 个等号，作为程序启动标题的上边框。
        console.log("=".repeat(80));

        // 打印程序名称。
        console.log("电子书处理程序");

        // 打印 80 个等号，作为程序启动标题的下边框。
        console.log("=".repeat(80));

        // 提示开始连接 Milvus。
        console.log("链接到Milvus...");

        // 等待 MilvusClient 完成连接；连接失败会跳到当前 try 对应的 catch。
        await client.connectPromise;

        // 输出连接成功信息。
        console.log("已连接");

        // 当前项目只处理一本书，所以把书籍 ID 固定为 1。
        // 注意 Milvus 中 book_id 被声明为 VarChar，实际项目最好改成字符串 "1"。
        const bookId = 1;

        // 确保 ebook 集合、字段、索引和加载状态已经准备好。
        await ensureCollection(bookId);

        // 解析 EPUB、拆分文本、生成 Embedding，并把结果写入 Milvus。
        await loadAndProcessEPubStreaming(bookId);
    } catch (err) {
        // 捕获连接 Milvus 等仍然向上抛到主入口的异常。
        console.error("主程序出错", err);
    }
};

// 调用程序入口。
// main 是 async 函数，这里没有额外 await；Node 会继续处理其中已经启动的异步任务。
main();
