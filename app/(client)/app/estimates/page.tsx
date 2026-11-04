import { redirect } from 'next/navigation'
import { and, desc, eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db, estimates } from '@/db'
import { getActiveClientFile, acceptEstimateAction, rejectEstimateAction } from '@/lib/actions/files'
import { getCommissionSettings } from '@/lib/services/settings'

export default async function ClientEstimatesPage() {
  const session = await getSession('client')
  if (!session?.clientId) redirect('/login')
  const file = await getActiveClientFile(session.clientId, session.taxYear)
  if (!file) return <div className="dash-card">No file for {session.taxYear}</div>
  const rows = await db
    .select()
    .from(estimates)
    .where(and(eq(estimates.fileNo, file.fileNo), eq(estimates.year, file.year)))
    .orderBy(desc(estimates.createdOn))
  const { zelleId } = await getCommissionSettings()

  return (
    <div className="dash-card">
      <h2 style={{ marginTop: 0, fontSize: 22 }}>Tax estimates</h2>
      <p className="dash-muted">Review and accept an estimate to move to payment.</p>
      <table className="dash-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Items</th>
            <th>Remark</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id}>
              <td>{e.createdOn?.toISOString?.().slice(0, 10) || '—'}</td>
              <td>{e.status}</td>
              <td>
                {Array.isArray(e.lineItems) && e.lineItems.length
                  ? e.lineItems.map((i) => `${i.label}: $${i.amount}`).join(', ')
                  : e.body?.slice(0, 80) || '—'}
              </td>
              <td>{e.remark}</td>
              <td>
                {e.status === 'sent' && (
                  <div className="dash-actions">
                    <form
                      action={async () => {
                        'use server'
                        await acceptEstimateAction(e.id)
                      }}
                    >
                      <button className="dash-btn">Accept</button>
                    </form>
                    <form
                      action={async () => {
                        'use server'
                        await rejectEstimateAction(e.id)
                      }}
                    >
                      <button className="dash-btn secondary">Reject</button>
                    </form>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={5}>No estimates yet</td>
            </tr>
          )}
        </tbody>
      </table>
      {zelleId && (
        <p className="dash-muted" style={{ marginTop: 16 }}>
          After accepting, pay via Zelle to <strong>{zelleId}</strong> and upload a payment screenshot under Documents.
        </p>
      )}
    </div>
  )
}
