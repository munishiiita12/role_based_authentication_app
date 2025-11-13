import './globals.css'

export const metadata = {
  title: 'Role-Based Auth App',
  description: 'Full-stack role-based authentication application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
