import { redirect } from 'next/navigation'
import { desc, eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db, payments, invoices } from '@/db'
import { recordPaymentAction } from '@/lib/actions/files'
import { AuthForm } from '@/components/dashboard/auth-form'

export default async function StaffPaymentsPage() {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  const rows = await db.select().from(payments).orderBy(desc(payments.id)).limit(200)
  const openInvoices = await db.select().from(invoices).where(eq(invoices.paymentStatus, 'none')).limit(100)

  return (
    <>
      <div className="dash-page-head">
        <div className="dash-page-head-copy">
          <p className="dash-eyebrow">Workspace</p>
          <h2>Payment ledger</h2>
          <div className="dash-page-head-desc">Record Zelle / Other payments and mark invoices paid. No card processors.</div>
        </div>
      </div>
      <div className="dash-card">
      <AuthForm action={recordPaymentAction} submitLabel="Record payment">
        <div className="dash-grid-2">
          <label>
            File no
            <input name="fileNo" required />
          </label>
          <label>
            Year
            <input name="year" type="number" defaultValue={session.taxYear} required />
          </label>
        </div>
        <label>
          Link invoice
          <select name="invoiceId" defaultValue="">
            <option value="">None</option>
            {openInvoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                #{inv.id} · file {inv.fileNo} · ${inv.total}
              </option>
            ))}
          </select>
        </label>
        <div className="dash-grid-2">
          <label>
            Source
            <select name="source" defaultValue="zelle">
              <option value="zelle">Zelle</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Amount received
            <input name="paymentReceived" required />
          </label>
        </div>
        <div className="dash-grid-2">
          <label>
            Total fee
            <input name="totalFee" type="number" defaultValue={0} />
          </label>
          <label>
            Discount
            <input name="discount" defaultValue="0" />
          </label>
        </div>
        <label>
          Referral bonus
          <input name="referralBonus" defaultValue="0" />
        </label>
        <label>
          Remarks
          <input name="remarks" />
        </label>
      </AuthForm>
      </div>
      <div className="dash-card dash-card--flush">
      <div style={{ padding: '16px 18px 0' }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>Recent payments</h3>
      </div>
      <table className="dash-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>File</th>
            <th>Invoice</th>
            <th>Source</th>
            <th>Received</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <td>{p.date}</td>
              <td>{p.fileNo}</td>
              <td>{p.invoiceId || p.invoiceNo || '—'}</td>
              <td>{p.source}</td>
              <td>{p.paymentReceived}</td>
              <td>{p.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  )
}
