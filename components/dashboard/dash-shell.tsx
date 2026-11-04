'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export function DashShell({
  sidebar,
  title,
  topbarRight,
  children,
}: {
  sidebar: React.ReactNode
  title: React.ReactNode
  topbarRight?: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="dash-shell" data-nav-open={open || undefined}>
      <aside className="dash-sidebar" id="dash-sidebar" data-open={open || undefined}>
        {sidebar}
      </aside>
      {open ? (
        <button
          type="button"
          className="dash-sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-lead">
            <button
              type="button"
              className="dash-menu-btn"
              aria-expanded={open}
              aria-controls="dash-sidebar"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
              <span className="dash-menu-label">{open ? 'Close' : 'Menu'}</span>
            </button>
            {typeof title === 'string' ? <h1>{title}</h1> : title}
          </div>
          {topbarRight ? <div className="dash-topbar-right">{topbarRight}</div> : null}
        </header>
        <div className="dash-content">{children}</div>
      </div>
    </div>
  )
}
