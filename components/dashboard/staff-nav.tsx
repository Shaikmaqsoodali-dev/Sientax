'use client'

import { DashNavLink } from '@/components/dashboard/dash-nav-link'
import { STAGE_GROUPS, byCode } from '@/lib/pipeline'

export function StaffNav({
  counts,
  unread,
  isAdmin,
}: {
  counts: Record<number, number>
  unread: number
  isAdmin: boolean
}) {
  return (
    <nav className="dash-nav" aria-label="Staff">
      <DashNavLink href="/staff" exact>
        Registration / Home
      </DashNavLink>
      {STAGE_GROUPS.map((g) => (
        <div key={g.stage}>
          <div className="dash-nav-group">{g.stage}</div>
          {g.codes.map((code) => {
            const def = byCode(code)!
            const n = counts[code] || 0
            return (
              <DashNavLink key={code} href={`/staff/files?a=${code}`} matchQuery={{ key: 'a', value: String(code) }}>
                <span>{def.label}</span>
                {n > 0 && <span className="badge">{n}</span>}
              </DashNavLink>
            )
          })}
        </div>
      ))}
      <div className="dash-nav-group">Workspace</div>
      <DashNavLink href="/staff/notifications">
        Notifications
        {unread > 0 && <span className="badge">{unread}</span>}
      </DashNavLink>
      <DashNavLink href="/staff/invoices">Invoices</DashNavLink>
      <DashNavLink href="/staff/payments">Payments</DashNavLink>
      {isAdmin ? (
        <>
          <div className="dash-nav-group">Admin</div>
          <DashNavLink href="/staff/employees">Employees</DashNavLink>
          <DashNavLink href="/staff/reports">Reports</DashNavLink>
          <DashNavLink href="/staff/referrers">Referrers</DashNavLink>
        </>
      ) : null}
    </nav>
  )
}
