import 'nextra-theme-blog/style.css'

export const metadata = {
  title: 'My Blog'
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
