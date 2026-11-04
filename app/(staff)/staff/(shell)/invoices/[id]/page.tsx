import { notFound, redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db, invoices } from '@/db'

export default async function StaffInvoiceView({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  const { id } = await params
  const [inv] = await db.select().from(invoices).where(eq(invoices.id, Number(id))).limit(1)
  if (!inv) notFound()
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
        File {inv.fileNo} · {inv.date} · {inv.paymentStatus === 'none' ? 'NOT PAID' : 'PAID'} · by {inv.createdBy}
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
    </div>
  )
}
