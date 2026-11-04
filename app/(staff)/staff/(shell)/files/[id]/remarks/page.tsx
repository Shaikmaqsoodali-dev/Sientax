import { notFound, redirect } from 'next/navigation'
import { and, desc, eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db, history } from '@/db'
import { getTaxFileById, addRemarkAction } from '@/lib/actions/files'
import { AuthForm } from '@/components/dashboard/auth-form'

export default async function FileRemarksPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  const { id } = await params
  const row = await getTaxFileById(Number(id))
  if (!row) notFound()
  const rows = await db
    .select()
    .from(history)
    .where(and(eq(history.fileNo, row.file.fileNo), eq(history.year, row.file.year)))
    .orderBy(desc(history.createdAt))

  return (
    <div className="dash-card">
      <h3 style={{ marginTop: 0 }}>History & remarks</h3>
      <AuthForm action={addRemarkAction} submitLabel="Add remark">
        <input type="hidden" name="fileNo" value={row.file.fileNo} />
        <input type="hidden" name="year" value={row.file.year} />
        <input type="hidden" name="fileId" value={row.file.id} />
        <label>
          Remark
          <textarea name="remark" required />
        </label>
      </AuthForm>
      <table className="dash-table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>When</th>
            <th>Who</th>
            <th>Action</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((h) => (
            <tr key={h.id}>
              <td>{h.createdAt?.toISOString?.().replace('T', ' ').slice(0, 19)}</td>
              <td>{h.employee}</td>
              <td>{h.action}</td>
              <td>{h.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
