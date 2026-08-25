'use client';
import { useState } from 'react';
import SidebarNoteItem from './SidebarNoteItem';

export default function SidebarNoteList({ notes }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  let filtered = notes;
  if (q) {
    const order = { title: 0, content: 1 };
    filtered = notes
      .map((note) => {
        const titleHit = (note.title || '').toLowerCase().includes(q);
        const contentHit = (note.content || '').toLowerCase().includes(q);
        return { note, group: titleHit ? 'title' : contentHit ? 'content' : 'none' };
      })
      .filter((item) => item.group !== 'none')
      .sort((a, b) => order[a.group] - order[b.group])
      .map((item) => item.note);
  }

  return (
    <div className="sidebar-note-list">
      <div className="sidebar-search">
        <input
          type="search"
          placeholder="搜索笔记（标题优先）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {filtered.length === 0 ? (
        <div className="notes-empty">没有找到匹配的笔记</div>
      ) : (
        <ul className="notes-list">
          {filtered.map((note) => (
            <SidebarNoteItem key={note.id} noteId={note.id} note={note} />
          ))}
        </ul>
      )}
    </div>
  );
}