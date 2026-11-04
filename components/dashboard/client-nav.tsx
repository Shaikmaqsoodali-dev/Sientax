'use client'

import { DashNavLink } from '@/components/dashboard/dash-nav-link'

const NAV = [
  { href: '/app', label: 'Home', exact: true },
  { href: '/app/profile', label: 'Personal Information' },
  { href: '/app/interview', label: 'Interview Sheet' },
  { href: '/app/documents', label: 'Documents' },
  { href: '/app/estimates', label: 'Estimates' },
  { href: '/app/invoices', label: 'Invoices' },
  { href: '/app/refer', label: 'Refer & Earn' },
]

export function ClientNav() {
  return (
    <nav className="dash-nav" aria-label="Client">
      {NAV.map((item) => (
        <DashNavLink key={item.href} href={item.href} exact={item.exact}>
          {item.label}
        </DashNavLink>
      ))}
    </nav>
  )
}
