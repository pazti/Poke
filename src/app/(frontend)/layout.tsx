import React from 'react'
import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Poke — Get paid without the awkward text',
  description:
    'Poke automates friendly payment reminders for freelancers and independent creators.',
  openGraph: {
    title: 'Poke — Get paid without the awkward text',
    description:
      'Poke automates friendly payment reminders for freelancers and independent creators.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="root" tabIndex={-1}>
          {children}
        </div>
      </body>
    </html>
  )
}
