import Link from "next/link";

export default function DashboardLayout({children}){
    return(
        <div>
            <nav>Nav
                <ul>
                <li><Link href="/dashboard/setting">Setting</Link></li>
                
                </ul>
            </nav>
            {children}
        </div>
    )
}