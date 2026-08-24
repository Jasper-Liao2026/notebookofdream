import SidebarNoteItem from '@/components/SidebarNoteItem';
export default function SidebarNoteList({ notes }) {
    const arr = Object.entries(notes);
  if(arr.length == 0){
    return <div className="notes-empty">No notes found.</div>;
  }
  return (<ul className="notes-list">
    {
        arr.map(([noteId, note])=>{
            return(
                <li key={noteId}>
                    <SidebarNoteItem noteId={noteId} note={JSON.parse(note)} />
                </li>
            )
        })
    }
  </ul>)

}