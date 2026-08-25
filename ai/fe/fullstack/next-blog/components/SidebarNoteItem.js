// 侧边栏单个笔记项：左键打开，右键弹出删除菜单
'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import Link from 'next/link';
import { deleteNoteById } from '@/app/actions';

const MENU_W = 120; // 菜单估算宽度，用于边界翻转时判断
const MENU_H = 44;  // 菜单估算高度

// 模块级变量：记录「当前打开着的菜单」的关闭函数。
// 打开新菜单前先调用它关闭旧菜单，从而保证同一时刻只有一个删除菜单。
let closeActiveMenu = null;

export default function SidebarNoteItem({ noteId, note }) {
  const { title, content = '', updateTime } = note;
  const [menu, setMenu] = useState(null); // { x, y } 或 null

  // 菜单打开后：点击空白处 / 滚动 / 按 Esc 都关闭菜单
  useEffect(() => {
    if (!menu) return;

    const close = () => setMenu(null);
    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };

    window.addEventListener('click', close);
    // 用 capture 捕获子元素滚动（侧边栏列表滚动事件不会冒泡到 window）
    window.addEventListener('scroll', close, true);
    window.addEventListener('keydown', onKeyDown);
    closeActiveMenu = close;

    return () => {
      // 只有自己仍是被记录的菜单时才清空全局引用，避免误清别人新开的菜单
      if (closeActiveMenu === close) closeActiveMenu = null;
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menu]);

  function handleContextMenu(e) {
    e.preventDefault(); // 阻止浏览器默认右键菜单，换成自定义删除菜单
    // 先关闭之前还开着的菜单，避免出现多个删除菜单
    if (closeActiveMenu) closeActiveMenu();

    // 菜单位置紧贴右键处（即所选区块旁），并在视口边缘自动翻转，防止被裁掉
    let x = e.clientX + 8;
    let y = e.clientY + 8;
    if (x + MENU_W > window.innerWidth) x = e.clientX - MENU_W - 8;
    if (y + MENU_H > window.innerHeight) y = e.clientY - MENU_H - 8;

    setMenu({ x, y });
  }

  return (
    <li className="sidebar-note-list-item" onContextMenu={handleContextMenu}>
      <Link href={`/note/${noteId}`} className="sidebar-note-open" title={title}></Link>
      <header className="sidebar-note-header">
        <strong>{title}</strong>
        <small>{dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss')}</small>
      </header>
      <p className="sidebar-note-excerpt">{content ? content.substring(0, 20) : <i>(无内容)</i>}</p>

      {menu &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: menu.y,
              left: menu.x,
              zIndex: 9999, // 足够大，确保显示在所有元素最上层
              background: '#fff',
              border: '1px solid #e4e6eb',
              borderRadius: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              padding: 4,
              minWidth: MENU_W,
            }}
          >
            <button
              type="button"
              onClick={() => deleteNoteById(noteId)}
              style={{
                display: 'block',
                width: '100%',
                border: 'none',
                background: 'none',
                padding: '6px 12px',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#bd0d2a',
                borderRadius: 4,
              }}
            >
              删除
            </button>
          </div>,
          document.body
        )}
    </li>
  );
}