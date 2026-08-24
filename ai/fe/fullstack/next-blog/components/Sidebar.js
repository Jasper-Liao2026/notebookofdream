import React from 'react';
import Link from 'next/link';
import {getAllNotes} from '@/lib/redis';
import SidebarNoteList from './SidebarNoteList';
export default async function Sidebar(){
    const notes = await getAllNotes();
    return(
        <section className="col sidebar">
            <Link href="/" className="sidebar-header">
            <img
            className="logo"
            src="/logo.svg"
            width="22px"
            height="20px"
            role="presentation"
            />
            <strong>LLM Notes</strong>
            </Link>
            <section className="sidebar-menu" role="menubar">
            </section>
            <nav>
                <SidebarNoteList notes={notes} />
            </nav>
        </section>
    )
}