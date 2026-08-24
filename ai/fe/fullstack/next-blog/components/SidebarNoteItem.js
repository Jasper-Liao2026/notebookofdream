import dayjs from 'dayjs';
import Link from 'next/link';
export default function SidebarNoteItem({ noteId, note }) {
    const {title,content='',updateTime}=note
    return(
        <li className="sidebar-note-list-item">
            <Link href={`/note/${noteId}`} className="sidebar-note-open" title={title}>
            </Link>
            <header className="sidebar-note-header">
                <strong>{title}</strong>
                <small>{dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss')}</small>
            </header>
            <p className="sidebar-note-excerpt">{content ? content.substring(0, 20) : <i>(无内容)</i>}</p>
        </li>
    )
}