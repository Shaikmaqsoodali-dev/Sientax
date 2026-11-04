import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db, clients } from '@/db'
import { getCommissionSettings } from '@/lib/services/settings'

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
    <div className="dash-card" style={{ maxWidth: 640 }}>
      <h2 style={{ marginTop: 0, fontSize: 22 }}>Refer & Earn</h2>
      <p className="dash-muted">Share your code. Converted referrals earn commission.</p>
      <p>
        Your code: <strong style={{ fontSize: 22 }}>{code}</strong>
      </p>
      <p>
        Share link:{' '}
        <a href={`${appUrl}/r/${code}`}>
          {appUrl}/r/{code}
        </a>
      </p>
      <table className="dash-table">
        <tbody>
          <tr>
            <td>Total referred</td>
            <td>{referred.length}</td>
          </tr>
          <tr>
            <td>Converted</td>
            <td>{converted.length}</td>
          </tr>
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
            <td>${(earnings - fees).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <p className="dash-muted">Payments will be settled on 30th of April.</p>
    </div>
  )
}
