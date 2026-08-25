// 数据库访问层：统一在这里与 PostgreSQL 交互（增删改查笔记）。
// 其它文件只需要 import 这里的函数，不需要直接接触 SQL 细节。
import { Pool } from 'pg';

// 连接串从环境变量读取（Next.js 会自动加载项目根目录的 .env.local）。
// 格式：postgres://用户名:密码@主机:端口/数据库名
const connectionString = process.env.DATABASE_URL;

// Pool 是「连接池」：维护一批可复用的连接，避免每次查询都重新建立连接带来的开销。
// 用 globalThis 缓存单例，防止开发模式热更新时重复创建连接池。
const globalForDb = globalThis;
const pool =
  globalForDb.__pgPool ||
  (globalForDb.__pgPool = new Pool({ connectionString }));

// 这个 Promise 保证「建表 + 写入示例数据」只执行一次，且幂等（可安全重复调用）。
let tableReadyPromise = null;

function ensureTable() {
  if (!tableReadyPromise) {
    tableReadyPromise = (async () => {
      // 建表：IF NOT EXISTS 表示表已存在就跳过，不会报错
      await pool.query(`
        CREATE TABLE IF NOT EXISTS notes (
          id          TEXT PRIMARY KEY,
          title       TEXT NOT NULL,
          content     TEXT NOT NULL DEFAULT '',
          update_time TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      // 写入示例数据：ON CONFLICT DO NOTHING 表示 id 已存在就跳过，避免重复插入
      await pool.query(`
        INSERT INTO notes (id, title, content, update_time) VALUES
          ('1702459181837', 'sunt aut', 'quia et suscipit suscipit recusandae', '2023-12-13T09:19:48.837Z'),
          ('1702459182837', 'qui est', 'est rerum tempore vitae sequi sint', '2023-12-13T09:19:48.837Z'),
          ('1702459188837', 'ea molestias', 'et iusto sed quo iure', '2023-12-13T09:19:48.837Z')
        ON CONFLICT (id) DO NOTHING
      `);
    })();
  }
  return tableReadyPromise;
}

// 把数据库里的一行（数据库用 snake_case 命名）转成组件用的对象（camelCase）
function toNote(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    updateTime: row.update_time,
  };
}

// 读取全部笔记，按更新时间倒序（最新的在最上面）
export async function getAllNotes() {
  await ensureTable();
  const { rows } = await pool.query(
    'SELECT * FROM notes ORDER BY update_time DESC'
  );
  return rows.map(toNote);
}

// 根据 id 读取单条笔记，找不到返回 null
export async function getNote(id) {
  await ensureTable();
  // $1 是参数占位符，真实值由第二个参数数组提供，能避免 SQL 注入
  const { rows } = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
  return rows.length ? toNote(rows[0]) : null;
}

// 新增一条笔记，id 用当前毫秒时间戳生成
export async function createNote({ title, content }) {
  await ensureTable();
  const id = Date.now().toString();
  const { rows } = await pool.query(
    'INSERT INTO notes (id, title, content) VALUES ($1, $2, $3) RETURNING *',
    [id, title, content]
  );
  return toNote(rows[0]);
}

// 更新笔记，并刷新更新时间
export async function updateNote(id, { title, content }) {
  await ensureTable();
  const { rows } = await pool.query(
    'UPDATE notes SET title = $1, content = $2, update_time = now() WHERE id = $3 RETURNING *',
    [title, content, id]
  );
  return rows.length ? toNote(rows[0]) : null;
}

// 删除笔记
export async function deleteNote(id) {
  await ensureTable();
  await pool.query('DELETE FROM notes WHERE id = $1', [id]);
}