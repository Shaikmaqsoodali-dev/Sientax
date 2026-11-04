import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { logoutAction } from '@/lib/actions/auth'
import { YearSwitcher } from '@/components/dashboard/year-switcher'
import { DashShell } from '@/components/dashboard/dash-shell'
import { ShellBrand } from '@/components/dashboard/shell-brand'
import { ClientNav } from '@/components/dashboard/client-nav'

export default async function ClientAppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession('client')
  if (!session) redirect('/login')

  return (
    <DashShell
      title="Client dashboard"
      sidebar={
        <>
          <ShellBrand href="/app" portal="Client portal" />
          <Suspense fallback={<nav className="dash-nav" />}>
            <ClientNav />
          </Suspense>
          <div className="dash-sidebar-foot">
            <form action={logoutAction.bind(null, 'client')}>
              <button type="submit" className="dash-btn ghost-dark">
                Log out
              </button>
            </form>
          </div>
        </>
      }
      topbarRight={
        <>
          <YearSwitcher portal="client" year={session.taxYear} />
          <span className="dash-user-chip">
            <strong>{session.name}</strong>
          </span>
        </>
      }
    >
      {children}
    </DashShell>
  )
}
