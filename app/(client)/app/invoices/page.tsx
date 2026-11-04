import Link from 'next/link'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db, invoices } from '@/db'
import { getActiveClientFile } from '@/lib/actions/files'
import { getCommissionSettings } from '@/lib/services/settings'
import { PageHeader } from '@/components/dashboard/page-header'

export default async function ClientInvoicesPage() {
  const session = await getSession('client')
  if (!session?.clientId) redirect('/login')
  const file = await getActiveClientFile(session.clientId, session.taxYear)
  if (!file) {
    return (
      <>
        <PageHeader eyebrow="Billing" title="Invoices" />
        <div className="dash-card">No file for {session.taxYear}</div>
      </>
    )
  }
  const rows = await db.select().from(invoices).where(eq(invoices.fileNo, file.fileNo))
  const { zelleId } = await getCommissionSettings()

  return (
    <>
      <PageHeader
        eyebrow={`File ${file.fileNo}`}
        title="Invoices"
        description={
          zelleId
            ? `Pay via Zelle to ${zelleId}. Card checkout is not available.`
            : 'View invoice totals and payment status for this tax year.'
        }
      />
      <div className="dash-card dash-card--flush">
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
                  <td>
                    <span className={unpaid ? 'dash-pill dash-pill--warn' : 'dash-pill dash-pill--live'}>
                      {unpaid ? 'Not paid' : 'Paid'}
                    </span>
                  </td>
                  <td>{inv.paymentMode || '—'}</td>
                  <td>
                    <Link href={`/app/invoices/${inv.id}`}>View</Link>
                    {unpaid ? <div className="dash-muted" style={{ margin: '4px 0 0' }}>Contact us to pay</div> : null}
                  </td>
                </tr>
              )
            })}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="dash-empty">
                  No invoices
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
