// 笔记查看/编辑页：直接内联读写，无需跳转单独编辑页
import { getNote } from '@/lib/db';
import { notFound } from 'next/navigation';
import NoteEditor from '@/components/NoteEditor';

export default async function NotePage({ params }) {
  // Next 16 中 params 是 Promise，需要 await 取出 id
  const { id } = await params;
  const note = await getNote(id);

  // 找不到笔记时返回 404 页面
  if (!note) notFound();

  // 只传编辑器需要的字段，避免把 Date 等不可序列化值传进客户端组件
  return <NoteEditor note={{ id: note.id, title: note.title, content: note.content }} />;
}