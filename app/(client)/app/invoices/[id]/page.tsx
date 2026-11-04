import { notFound, redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db, invoices } from '@/db'
import { getActiveClientFile } from '@/lib/actions/files'

export default async function ClientInvoiceView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession('client')
  if (!session?.clientId) redirect('/login')
  const file = await getActiveClientFile(session.clientId, session.taxYear)
  if (!file) notFound()
  const [inv] = await db.select().from(invoices).where(eq(invoices.id, Number(id))).limit(1)
  if (!inv || inv.fileNo !== file.fileNo) notFound()

  const items = Array.isArray(inv.lineItems) && inv.lineItems.length
    ? inv.lineItems
    : [{ description: inv.description, amount: Number(inv.total) || 0 }]

  return (
    <div className="dash-card" style={{ maxWidth: 720 }}>
      <h2 style={{ marginTop: 0 }}>Invoice #{inv.id}</h2>
      <p>
        <strong>{inv.name}</strong>
        <br />
        {inv.address}
      </p>
      <p className="dash-muted">
        File {inv.fileNo} · {inv.date} · {inv.paymentStatus === 'none' ? 'NOT PAID' : 'PAID'}
      </p>
      <table className="dash-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.description}</td>
              <td>${item.amount}</td>
            </tr>
          ))}
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td>
              <strong>${inv.total}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="dash-muted" style={{ marginTop: 16 }}>
        Use your browser print dialog to save a PDF of this invoice.
      </p>
    </div>
  )
}
