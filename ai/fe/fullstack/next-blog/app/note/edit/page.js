// 新建笔记页：不再让用户先填标题/内容，而是一进来就直接在服务端创建一条空笔记，
// 并跳转到它的详情页（详情页本身就是内联编辑器，可以马上开始写）
import { createNote } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function NewNotePage() {
  // 直接创建空笔记（标题、内容都留空），拿到新生成的 id
  const note = await createNote({ title: '', content: '' });

  // 跳转到详情页继续编辑（redirect 内部会抛出中断，属于期望用法）
  redirect(`/note/${note.id}`);
}