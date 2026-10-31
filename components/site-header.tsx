'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight, ArrowUpRight, ChevronDown, Home, User, Briefcase, Mail, MessageCircle, HelpCircle, Phone, Handshake, FileText, RotateCcw, Banknote, ShieldAlert, Building2, CreditCard } from 'lucide-react'

const services: { label: string; hint: string; href: string; icon: React.ElementType }[] = [
  { label: 'US Individual Tax Filing', hint: 'Personal returns, filed with care', href: '/services/us-individual-tax-filing', icon: User },
  { label: 'Tax Audit Representation', hint: 'Professional support before the IRS', href: '/services/tax-audit-representation', icon: ShieldAlert },
  { label: 'Amendment Filing', hint: 'Correct and refile past returns', href: '/services/amendment-filing', icon: RotateCcw },
  { label: 'Corporate Tax', hint: 'Compliant, optimized business tax', href: '/services/corporate-tax', icon: Building2 },
  { label: 'Payroll Service', hint: 'Accurate payroll, every cycle', href: '/services/payroll-service', icon: CreditCard },
]

const refundStatus: { label: string; href: string; icon: React.ElementType }[] = [
  { label: 'Federal', href: 'https://www.irs.gov/wheres-my-refund', icon: FileText },
  { label: 'Amendment', href: 'https://www.irs.gov/filing/wheres-my-amended-return', icon: RotateCcw },
  { label: 'Federal & State Payments', href: 'https://www.irs.gov/refunds', icon: Banknote },
]

const links: { label: string; href: string; icon?: React.ElementType }[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/about', icon: User },
  { label: 'How we work', href: '/process', icon: Briefcase },
  { label: 'CPA Hub', href: '/cpa-collaboration', icon: Handshake },
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [refundOpen, setRefundOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus whenever the route changes.
  useEffect(() => {
    setOpen(false)
    setMenuOpen(false)
    setRefundOpen(false)
  }, [pathname])

  // Close on Escape and return focus to the toggle button.
  useEffect(() => {
    if (!open && !menuOpen && !refundOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      setMenuOpen(false)
      setRefundOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, menuOpen, refundOpen])

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
  const servicesActive = pathname.startsWith('/services')

  return (
    <header className={scrolled || open ? 'site-header is-scrolled' : 'site-header'}>
      <div className="header-inner">
        <Link href="/" className="logo-link" aria-label="Sientax home">
          <img
            src="/Sientax-Logo-2024-01-1.webp"
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
          <Link
            href="/"
            className={isActive('/') ? 'nav-link is-active' : 'nav-link'}
            aria-current={isActive('/') ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            <Home size={15} /> Home
          </Link>
          <Link
            href="/about"
            className={isActive('/about') ? 'nav-link is-active' : 'nav-link'}
            aria-current={isActive('/about') ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            <User size={15} /> About
          </Link>

          <div className={`nav-item${menuOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className={servicesActive ? 'nav-link nav-trigger is-active' : 'nav-link nav-trigger'}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              onClick={() => setMenuOpen(v => !v)}
            >
              Services <ChevronDown size={15} />
            </button>
            <div className="nav-menu">
              <span className="nav-menu-head">
                <strong>Services</strong>
                <span>Tax support for individuals and businesses.</span>
              </span>
              {services.map(({ label, hint, href, icon: Icon }) => (
                <Link href={href} className="nav-menu-link" key={href} onClick={() => setOpen(false)}>
                  <span className="nav-menu-link-icon">
                    <Icon size={15} />
                  </span>
                  <span>
                    {label}
                    <small>{hint}</small>
                  </span>
                  <ArrowUpRight size={15} />
                </Link>
              ))}
              <Link href="/services" className="nav-menu-foot" onClick={() => setOpen(false)}>
                View all services <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {links.map(({ label, href, icon: Icon }) => (
            <Link
              href={href}
              className={isActive(href) ? 'nav-link is-active' : 'nav-link'}
              aria-current={isActive(href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
              key={href}
            >
              {Icon && <Icon size={15} />}
              {label}
            </Link>
          ))}

          <div className={`nav-item nav-item--edge${refundOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="nav-link nav-trigger nav-link--underline"
              aria-expanded={refundOpen}
              aria-haspopup="true"
              onClick={() => setRefundOpen(v => !v)}
            >
              Refund Status <ChevronDown size={15} />
            </button>
            <div className="nav-menu nav-menu--compact">
              {refundStatus.map(({ label, href, icon: Icon }) => (
                <a
                  href={href}
                  className="nav-menu-link"
                  key={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setRefundOpen(false)
                    setOpen(false)
                  }}
                >
                  <Icon size={14} /> {label}
                </a>
              ))}
            </div>
          </div>

          <Link
            href="/contact"
            className={isActive('/contact') ? 'nav-link is-active' : 'nav-link'}
            aria-current={isActive('/contact') ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            <Mail size={15} /> Contact
          </Link>

          <div className="mobile-actions">
            <Link href="/contact" className="btn btn--green" onClick={() => setOpen(false)}>
              Book a free consultation <ArrowRight size={16} />
            </Link>
            <div className="mobile-contact">
              <a href="tel:+18005550199"><Phone size={15} /> +1 (800) 555-0199</a>
              <a href="mailto:support@sientax.com"><Mail size={15} /> support@sientax.com</a>
            </div>
          </div>
        </nav>

        <div className="header-actions">
          <Link href="/contact" className="btn btn--green btn--sm">
            Book a consultation <ArrowRight size={15} />
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
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  )
}
