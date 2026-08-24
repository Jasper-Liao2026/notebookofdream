import { getNote } from "@/lib/redis";
import dayjs from 'dayjs';

export default async function NotePage({ params }) {
  const note = await getNote(params.id);
  
  if (!note) {
    return <div className="note--empty-state">Note not found</div>;
  }

  return (
    <div className="note-page">
      <header className="note-header">
        <strong>{note.title}</strong>
        <small>{dayjs(note.updateTime).format('YYYY-MM-DD HH:mm:ss')}</small>
      </header>
      <div className="note-content">
        {note.content}
      </div>
    </div>
  );
}