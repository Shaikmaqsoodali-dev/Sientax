'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const links: [string, string][] = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['How we work', '/process'],
  ['FAQ', '/faq'],
  ['CPA Hub', '/cpa-collaboration'],
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}><Link href="/" className="logo-link" aria-label="Sientax home"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sientax-Logo-2024-01-1-eWrlrPsSyJNiyMZDG3M4MtQTNfSxYs.webp" alt="Sientax" /></Link><nav className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Primary navigation">{links.map(([label, href]) => <Link href={href} className={isActive(href) ? 'is-active' : undefined} aria-current={isActive(href) ? 'page' : undefined} onClick={() => setOpen(false)} key={href}>{label}</Link>)}<div className="mobile-actions"><Link href="/contact" className={isActive('/contact') ? 'text-link is-active' : 'text-link'} onClick={() => setOpen(false)}>Contact</Link><Link href="/contact" className="button button-dark" onClick={() => setOpen(false)}>Free consultation <ArrowUpRight size={16} /></Link></div></nav><div className="header-actions"><Link href="/contact" className={isActive('/contact') ? 'text-link is-active' : 'text-link'}>Contact</Link><Link href="/contact" className="button button-dark">Free consultation <ArrowUpRight size={16} /></Link></div><button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></header>
}
