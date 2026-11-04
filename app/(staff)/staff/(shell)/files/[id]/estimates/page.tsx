import { notFound, redirect } from 'next/navigation'
import { and, desc, eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db, estimates } from '@/db'
import { getTaxFileById } from '@/lib/actions/files'
import { EstimateBuilder } from '@/components/dashboard/estimate-builder'

export default async function FileEstimatesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  const { id } = await params
  const row = await getTaxFileById(Number(id))
  if (!row) notFound()
  const rows = await db
    .select()
    .from(estimates)
    .where(and(eq(estimates.fileNo, row.file.fileNo), eq(estimates.year, row.file.year)))
    .orderBy(desc(estimates.createdOn))

  return (
    <div className="dash-card">
      <h3 style={{ marginTop: 0 }}>Tax estimates</h3>
      <EstimateBuilder fileNo={row.file.fileNo} year={row.file.year} fileId={row.file.id} />
      <h3 style={{ marginTop: 28 }}>History</h3>
      <table className="dash-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>By</th>
            <th>Status</th>
            <th>Items</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id}>
              <td>{e.createdOn?.toISOString?.().slice(0, 10)}</td>
              <td>{e.createdBy}</td>
              <td>{e.status}</td>
              <td>
                {Array.isArray(e.lineItems) && e.lineItems.length
                  ? e.lineItems.map((i) => `${i.label}: $${i.amount}`).join(', ')
                  : e.body?.slice(0, 60)}
              </td>
              <td>{e.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
