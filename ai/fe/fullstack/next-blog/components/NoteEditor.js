// 内联笔记编辑器：不用跳到单独编辑页，直接在这里用鼠标选中内容改写/删除，停止输入后自动保存
'use client';
import { useState, useEffect, useRef } from 'react';
import { updateNoteInline } from '@/app/actions';

export default function NoteEditor({ note }) {
  const [title, setTitle] = useState(note.title ?? '');
  const [content, setContent] = useState(note.content ?? '');
  const [status, setStatus] = useState('saved'); // saved | saving | error
  const firstRender = useRef(true);

  // 输入变化后防抖自动保存（首次挂载不触发，避免无变化时也写库）
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setStatus('saving');
    const timer = setTimeout(async () => {
      try {
        await updateNoteInline(note.id, title, content);
        setStatus('saved');
      } catch {
        setStatus('error');
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [title, content, note.id]);

  const statusText =
    status === 'saving' ? '保存中…' : status === 'error' ? '保存失败' : '已保存';

  return (
    <div className="note-editor">
      <div className="note-editor-form" style={{ width: '100%', maxWidth: 800 }}>
        <input
          type="text"
          value={title}
          placeholder="笔记标题"
          style={{ fontFamily: 'var(--sans-serif)', fontSize: '1.5rem', fontWeight: 700, height: 'auto', border: 'none', paddingLeft: 0, boxShadow: 'none' }}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          value={content}
          placeholder="支持 Markdown，例如：# 标题、**加粗**"
          style={{
            height: '60vh',
            maxWidth: 'none',
            border: 'none',
            background: 'none',
            boxShadow: 'none',
            padding: '12px 0',
            resize: 'none',
            fontFamily: 'var(--sans-serif)',
            fontSize: '1rem',
            lineHeight: 1.75,
          }}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="note-editor-menu">
          <small className="note-save-status">{statusText}</small>
        </div>
      </div>
    </div>
  );
}