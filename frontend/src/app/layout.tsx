import './globals.css'
import VersionDisplay from '../components/VersionDisplay'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <VersionDisplay />
        {children}
      </body>
    </html>
  )
}