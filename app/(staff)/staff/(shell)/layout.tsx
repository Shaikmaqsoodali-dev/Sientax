import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { logoutAction } from '@/lib/actions/auth'
import { YearSwitcher } from '@/components/dashboard/year-switcher'
import { UsClocks } from '@/components/dashboard/us-clocks'
import { queueCounts, unreadStaffNotifications } from '@/lib/services/queues'
import { STAGE_GROUPS, byCode } from '@/lib/pipeline'

export default async function StaffShellLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')

  const isAdmin = session.role === 'admin'
  const counts = await queueCounts({
    empId: session.employeeId,
    year: session.taxYear,
    isAdmin,
  }).catch(() => ({} as Record<number, number>))
  const unread = session.employeeId
    ? await unreadStaffNotifications(session.employeeId).catch(() => 0)
    : 0

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <p className="dash-brand">Sientax</p>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--on-dark-soft)' }}>
          {isAdmin ? 'Admin' : 'Employee'} · {session.taxYear}
        </p>
        <nav className="dash-nav">
          <Link href="/staff">Registration / Home</Link>
          {STAGE_GROUPS.map((g) => (
            <div key={g.stage}>
              <div className="dash-nav-group">{g.stage}</div>
              {g.codes.map((code) => {
                const def = byCode(code)!
                const n = counts[code] || 0
                return (
                  <Link key={code} href={`/staff/files?a=${code}`}>
                    <span>{def.label}</span>
                    {n > 0 && <span className="badge">{n}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
          <div className="dash-nav-group">Workspace</div>
          <Link href="/staff/notifications">
            Notifications
            {unread > 0 && <span className="badge">{unread}</span>}
          </Link>
          <Link href="/staff/invoices">Invoices</Link>
          <Link href="/staff/payments">Payments</Link>
          {isAdmin && (
            <>
              <div className="dash-nav-group">Admin</div>
              <Link href="/staff/employees">Employees</Link>
              <Link href="/staff/reports">Reports</Link>
              <Link href="/staff/referrers">Referrers</Link>
            </>
          )}
          <form action={logoutAction.bind(null, 'staff')}>
            <button type="submit" className="dash-btn secondary" style={{ width: '100%', marginTop: 12 }}>
              Log out
            </button>
          </form>
        </nav>
      </aside>
      <div className="dash-main">
        <header className="dash-topbar">
          <h1>Staff dashboard</h1>
          <div className="dash-topbar-right">
            <UsClocks />
            <YearSwitcher portal="staff" year={session.taxYear} />
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{session.name}</span>
          </div>
        </header>
        <div className="dash-content">{children}</div>
      </div>
    </div>
  )
}
