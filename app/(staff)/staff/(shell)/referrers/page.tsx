import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { assertAdmin } from '@/lib/rbac'
import { db, clients } from '@/db'
import { getCommissionSettings } from '@/lib/services/settings'

export default async function ReferrersPage() {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  try {
    assertAdmin(session)
  } catch {
    redirect('/staff')
  }

  const referrers = await db.select().from(clients).where(eq(clients.role, 'refer'))
  const allClients = await db.select().from(clients)
  const { gross, fee } = await getCommissionSettings()

  return (
    <div className="dash-card">
      <h2 style={{ marginTop: 0, fontSize: 22 }}>Referrers</h2>
      <table className="dash-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Email</th>
            <th>Total refs</th>
            <th>Converted</th>
            <th>Receivable</th>
          </tr>
        </thead>
        <tbody>
          {referrers.map((r) => {
            const refs = allClients.filter((c) => c.referral === r.fileNo)
            const converted = refs.filter((c) => c.paymentStatus === 1)
            const receivable = converted.length * (Number(gross) - Number(fee))
            return (
              <tr key={r.id}>
                <td>
                  {r.firstName} {r.lastName}
                </td>
                <td>{r.fileNo}</td>
                <td>{r.email}</td>
                <td>{refs.length}</td>
                <td>{converted.length}</td>
                <td>${receivable.toFixed(2)}</td>
              </tr>
            )
          })}
          {!referrers.length && (
            <tr>
              <td colSpan={6}>No dedicated referrers</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
