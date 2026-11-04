import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db, clients } from '@/db'
import { getCommissionSettings } from '@/lib/services/settings'
import { PageHeader } from '@/components/dashboard/page-header'

export default async function ReferPage() {
  const session = await getSession('client')
  if (!session?.clientId) redirect('/login')
  const [user] = await db.select().from(clients).where(eq(clients.id, session.clientId)).limit(1)
  if (!user) redirect('/login')

  const code = user.fileNo
  const referred = await db.select().from(clients).where(eq(clients.referral, code))
  const converted = referred.filter((r) => r.paymentStatus === 1)
  const { gross, fee } = await getCommissionSettings()
  const earnings = converted.length * Number(gross)
  const fees = converted.length * Number(fee)
  const appUrl = process.env.APP_URL || 'http://localhost:3000'

  return (
    <>
      <PageHeader
        eyebrow="Growth"
        title="Refer & Earn"
        description="Share your code. Converted referrals earn commission."
      />
      <div className="dash-stat-row">
        <div className="dash-stat">
          <p className="dash-stat-label">Your code</p>
          <p className="dash-stat-value">{code}</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-label">Referred</p>
          <p className="dash-stat-value">{referred.length}</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-label">Converted</p>
          <p className="dash-stat-value">{converted.length}</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-label">Receivable</p>
          <p className="dash-stat-value">${(earnings - fees).toFixed(2)}</p>
        </div>
      </div>
      <div className="dash-card" style={{ maxWidth: 640 }}>
        <p className="dash-muted" style={{ marginTop: 0 }}>
          Share link:{' '}
          <a href={`${appUrl}/r/${code}`} style={{ color: 'var(--green-mid)', fontWeight: 600 }}>
            {appUrl}/r/{code}
          </a>
        </p>
        <table className="dash-table">
          <tbody>
            <tr>
              <td>Gross earnings</td>
              <td>${earnings.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Fees & taxes</td>
              <td>${fees.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Receivable</td>
              <td>
                <strong>${(earnings - fees).toFixed(2)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="dash-muted" style={{ marginBottom: 0 }}>
          Payments will be settled on 30th of April.
        </p>
      </div>
    </>
  )
}
