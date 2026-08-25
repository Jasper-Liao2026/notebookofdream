// 侧边栏：左侧的标题、「新建笔记」按钮和笔记列表（含搜索）
import React from 'react';
import Link from 'next/link';
import { getAllNotes } from '@/lib/db';
import SidebarNoteList from './SidebarNoteList';

export default async function Sidebar() {
  // 从数据库读取全部笔记（Server Component，可直接 await）
  const notes = await getAllNotes();

  return (
    <section className="col sidebar">
      <Link href="/" className="sidebar-header">
        <img className="logo" src="/logo.svg" width="22px" height="20px" role="presentation" />
        <strong>LLM Notes</strong>
      </Link>

      <section className="sidebar-menu">
        <Link href="/note/edit" className="edit-button edit-button--solid">新建笔记</Link>
      </section>

      <nav>
        <SidebarNoteList notes={notes} />
      </nav>
    </section>
  );
}