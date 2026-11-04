import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { logoutAction } from '@/lib/actions/auth'
import { YearSwitcher } from '@/components/dashboard/year-switcher'

const NAV = [
  { href: '/app', label: 'Home' },
  { href: '/app/profile', label: 'Personal Information' },
  { href: '/app/interview', label: 'Interview Sheet' },
  { href: '/app/documents', label: 'Documents' },
  { href: '/app/estimates', label: 'Estimates' },
  { href: '/app/invoices', label: 'Invoices' },
  { href: '/app/refer', label: 'Refer & Earn' },
]

export default async function ClientAppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession('client')
  if (!session) redirect('/login')

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <p className="dash-brand">Sientax</p>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--on-dark-soft)' }}>Client portal</p>
        <nav className="dash-nav">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <form action={logoutAction.bind(null, 'client')}>
            <button type="submit" className="dash-btn secondary" style={{ width: '100%', marginTop: 12 }}>
              Log out
            </button>
          </form>
        </nav>
      </aside>
      <div className="dash-main">
        <header className="dash-topbar">
          <h1>Client dashboard</h1>
          <div className="dash-topbar-right">
            <YearSwitcher portal="client" year={session.taxYear} />
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{session.name}</span>
          </div>
        </header>
        <div className="dash-content">{children}</div>
      </div>
    </div>
  )
}
