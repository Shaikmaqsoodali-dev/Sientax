'use client'

import { useEffect, useRef, useState } from 'react'
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
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Close on Escape and return focus to the toggle button.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
      <Link href="/" className="logo-link" aria-label="Sientax home">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sientax-Logo-2024-01-1-eWrlrPsSyJNiyMZDG3M4MtQTNfSxYs.webp"
          alt="Sientax"
          width={157}
          height={39}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </Link>

      <nav
        id="primary-menu"
        className={open ? 'main-nav is-open' : 'main-nav'}
        aria-label="Primary navigation"
      >
        {links.map(([label, href]) => (
          <Link
            href={href}
            className={isActive(href) ? 'is-active' : undefined}
            aria-current={isActive(href) ? 'page' : undefined}
            onClick={() => setOpen(false)}
            key={href}
          >
            {label}
          </Link>
        ))}
        <div className="mobile-actions">
          <Link
            href="/contact"
            className={isActive('/contact') ? 'text-link is-active' : 'text-link'}
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          <Link href="/contact" className="button button-dark" onClick={() => setOpen(false)}>
            Free consultation <ArrowUpRight size={16} />
          </Link>
        </div>
      </nav>

      <div className="header-actions">
        <Link href="/contact" className={isActive('/contact') ? 'text-link is-active' : 'text-link'}>
          Contact
        </Link>
        <Link href="/contact" className="button button-dark">
          Free consultation <ArrowUpRight size={16} />
        </Link>
      </div>

      <button
        ref={toggleRef}
        className="menu-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="primary-menu"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  )
}
