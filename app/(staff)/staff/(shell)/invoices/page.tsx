import Link from 'next/link'
import { redirect } from 'next/navigation'
import { desc } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db, invoices } from '@/db'
import { InvoiceBuilder } from '@/components/dashboard/invoice-builder'

export default async function StaffInvoicesPage() {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  const rows = await db.select().from(invoices).orderBy(desc(invoices.id)).limit(200)

  return (
    <>
      <div className="dash-page-head">
        <div className="dash-page-head-copy">
          <p className="dash-eyebrow">Workspace</p>
          <h2>Invoices</h2>
          <div className="dash-page-head-desc">Build firm invoices and track payment status.</div>
        </div>
      </div>
      <div className="dash-card">
      <InvoiceBuilder year={session.taxYear} />
      </div>
      <div className="dash-card dash-card--flush">
      <div style={{ padding: '16px 18px 0' }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>All invoices</h3>
      </div>
      <table className="dash-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>File</th>
            <th>Name</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((inv) => (
            <tr key={inv.id}>
              <td>#{inv.id}</td>
              <td>{inv.fileNo}</td>
              <td>{inv.name}</td>
              <td>${inv.total}</td>
              <td>{inv.paymentStatus === 'none' ? 'NOT PAID' : 'PAID'}</td>
              <td>{inv.date}</td>
              <td>
                <Link href={`/staff/invoices/${inv.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  )
}
