'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

type Props = {
  href: string
  children: React.ReactNode
  exact?: boolean
  matchQuery?: { key: string; value: string }
}

export function DashNavLink({ href, children, exact, matchQuery }: Props) {
  const pathname = usePathname()
  const search = useSearchParams()
  const path = href.split('?')[0]
  let active = exact ? pathname === path : pathname === path || pathname.startsWith(`${path}/`)

  if (matchQuery) {
    active = pathname === path && search.get(matchQuery.key) === matchQuery.value
  } else if (href.includes('?')) {
    const q = new URLSearchParams(href.split('?')[1] || '')
    active = pathname === path && [...q.entries()].every(([k, v]) => search.get(k) === v)
  } else if (path === '/staff/files' && search.get('a')) {
    // bare /staff/files link should not stay active on queue filters
    active = pathname === path && !search.get('a')
  }

  return (
    <Link href={href} data-active={active || undefined} aria-current={active ? 'page' : undefined}>
      {children}
    </Link>
  )
}
