'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { slug: '', label: 'Personal Info' },
  { slug: 'email', label: 'Email' },
  { slug: 'interview', label: 'Interview' },
  { slug: 'estimates', label: 'Tax Estimates' },
  { slug: 'review', label: 'Client Review' },
  { slug: 'remarks', label: 'History & Remarks' },
]

export function FileTabs({ fileId }: { fileId: number }) {
  const pathname = usePathname()
  const base = `/staff/files/${fileId}`

  return (
    <nav className="dash-tabs">
      {TABS.map((t) => {
        const href = t.slug ? `${base}/${t.slug}` : base
        const active = t.slug === '' ? pathname === base : pathname.endsWith(`/${t.slug}`)
        return (
          <Link key={t.slug || 'info'} href={href} data-active={active}>
            {t.label}
          </Link>
        )
      })}
    </nav>
  )
}
