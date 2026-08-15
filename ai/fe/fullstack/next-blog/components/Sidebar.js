import React from 'react';
import Link from 'next/link';

export default async function Sidebar(){
    return(
        <>
        sidebar
        
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
        </section>
        <section className="sidebar-menu" role="menubar">
            {/* SideSearchField */}
        </section>
        </>
    )
}