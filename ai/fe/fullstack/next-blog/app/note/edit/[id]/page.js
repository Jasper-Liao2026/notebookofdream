// 编辑笔记页：读取已有笔记，把内容预填进表单；提交时带上隐藏的 id 字段，走 saveNote 更新
import { getNote } from '@/lib/db';
import { notFound } from 'next/navigation';
import { saveNote } from '@/app/actions';

export default async function EditNotePage({ params }) {
  // Next 16 中 params 是 Promise，需要 await 取出 id
  const { id } = await params;
  const note = await getNote(id);

  // 找不到笔记时返回 404 页面，比显示空白更规范
  if (!note) notFound();

  return (
    <div className="note-editor">
      <form className="note-editor-form" action={saveNote}>
        {/* 隐藏字段：告诉 saveNote 这是一次「编辑」而不是「新增」 */}
        <input type="hidden" name="id" value={note.id} />

        <label className="label">标题</label>
        <input type="text" name="title" required defaultValue={note.title} />

        <label className="label">内容（Markdown）</label>
        <textarea name="content" defaultValue={note.content} style={{ height: 320 }} />

        <div className="note-editor-menu">
          <button type="submit" className="edit-button edit-button--solid">保存</button>
        </div>
      </form>
    </div>
  );
}