import Link from 'next/link'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db, invoices } from '@/db'
import { getActiveClientFile } from '@/lib/actions/files'
import { getCommissionSettings } from '@/lib/services/settings'

export default async function ClientInvoicesPage() {
  const session = await getSession('client')
  if (!session?.clientId) redirect('/login')
  const file = await getActiveClientFile(session.clientId, session.taxYear)
  if (!file) return <div className="dash-card">No file for {session.taxYear}</div>
  const rows = await db.select().from(invoices).where(eq(invoices.fileNo, file.fileNo))
  const { zelleId } = await getCommissionSettings()

  return (
    <div className="dash-card">
      <h2 style={{ marginTop: 0, fontSize: 22 }}>Invoices</h2>
      {zelleId && (
        <p className="dash-muted">
          Pay via Zelle to <strong>{zelleId}</strong>. Card checkout is not available.
        </p>
      )}
      <table className="dash-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
            <th>Mode</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((inv) => {
            const unpaid = inv.paymentStatus === 'none' || !inv.paymentStatus
            return (
              <tr key={inv.id}>
                <td>#{inv.id}</td>
                <td>${inv.total}</td>
                <td>{inv.date}</td>
                <td>{unpaid ? 'NOT PAID' : 'PAID'}</td>
                <td>{inv.paymentMode}</td>
                <td>
                  <Link href={`/app/invoices/${inv.id}`}>View</Link>
                  {unpaid && <div className="dash-muted">Please contact us for payment</div>}
                </td>
              </tr>
            )
          })}
          {!rows.length && (
            <tr>
              <td colSpan={6}>No invoices</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
