import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { logoutAction } from '@/lib/actions/auth'
import { YearSwitcher } from '@/components/dashboard/year-switcher'
import { UsClocks } from '@/components/dashboard/us-clocks'
import { DashShell } from '@/components/dashboard/dash-shell'
import { ShellBrand } from '@/components/dashboard/shell-brand'
import { StaffNav } from '@/components/dashboard/staff-nav'
import { queueCounts, unreadStaffNotifications } from '@/lib/services/queues'

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
    <DashShell
      title="Staff dashboard"
      sidebar={
        <>
          <ShellBrand
            href="/staff"
            portal={isAdmin ? `Admin · ${session.taxYear}` : `Employee · ${session.taxYear}`}
          />
          <Suspense fallback={<nav className="dash-nav" />}>
            <StaffNav counts={counts} unread={unread} isAdmin={isAdmin} />
          </Suspense>
          <div className="dash-sidebar-foot">
            <form action={logoutAction.bind(null, 'staff')}>
              <button type="submit" className="dash-btn ghost-dark">
                Log out
              </button>
            </form>
          </div>
        </>
      }
      topbarRight={
        <>
          <UsClocks />
          <YearSwitcher portal="staff" year={session.taxYear} />
          <span className="dash-user-chip">
            <strong>{session.name}</strong>
            <span>{isAdmin ? 'Admin' : 'Employee'}</span>
          </span>
        </>
      }
    >
      {children}
    </DashShell>
  )
}
