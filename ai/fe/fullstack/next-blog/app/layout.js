import './style.css';
import Sidebar from '@/components/Sidebar';
export default async function RootLayout({children}) {
  return (
    <html>
      <head>
        <title>My App</title>
        <meta name="description" content="First part"/>
        <meta name="keywords" content="llm ,claude 学习"/>
      </head>
      <body>
        <div className="container">
          <div className="main">
            <Sidebar/>
            <section className="col note-viewer">{children}</section>
          </div>
        </div>
      </body>
    </html>
  )
}