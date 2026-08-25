// Server Actions：在服务端执行的「修改数据」的函数，供表单 form action 或客户端组件直接调用
'use server';

import { createNote, updateNote, deleteNote } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 保存笔记（用于新建表单页）：带 id 是编辑，没带 id 是新增。
// 保存后统一跳转到该笔记的详情页（详情页本身就是编辑器，可继续直接读写）
export async function saveNote(formData) {
  const id = formData.get('id');
  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '');

  // 标题为空时直接返回（界面表单已用 required 拦截空提交）
  if (!title) return;

  let noteId = id;
  if (id) {
    await updateNote(id, { title, content });
  } else {
    const created = await createNote({ title, content });
    noteId = created.id;
  }

  revalidatePath('/');
  redirect(`/note/${noteId}`);
}

// 内联实时保存：详情页停止输入后自动调用，只更新数据并刷新缓存，不跳转页面
export async function updateNoteInline(id, title, content) {
  const t = String(title || '').trim();
  // 允许标题为空：空笔记只写内容时也能正常保存
  if (!id) return;
  await updateNote(id, { title: t, content: String(content || '') });
  revalidatePath('/');
}

// 删除笔记：供「表单 form action」使用，传 formData（含 id 字段）
export async function removeNote(formData) {
  const id = formData.get('id');
  if (id) {
    await deleteNote(id);
  }
  revalidatePath('/');
  redirect('/');
}

// 删除笔记：供侧边栏右键菜单直接调用，传 id 即可
export async function deleteNoteById(id) {
  if (id) {
    await deleteNote(id);
  }
  revalidatePath('/');
  redirect('/');
}