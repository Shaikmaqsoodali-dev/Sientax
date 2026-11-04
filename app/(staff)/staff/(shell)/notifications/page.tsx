import Link from 'next/link'
import { redirect } from 'next/navigation'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db, notifications, taxFiles } from '@/db'
import { markNotificationsReadAction } from '@/lib/actions/files'

export default async function NotificationsPage() {
  const session = await getSession('staff')
  if (!session?.employeeId) redirect('/staff/login')
  await markNotificationsReadAction()

  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.targetEmpId, session.employeeId))
    .orderBy(desc(notifications.createdAt))
    .limit(100)

  const fileNos = [...new Set(rows.map((r) => r.fileNo).filter(Boolean))]
  const fileMap = new Map<string, number>()
  if (fileNos.length) {
    const files = await db
      .select({ id: taxFiles.id, fileNo: taxFiles.fileNo })
      .from(taxFiles)
      .where(and(inArray(taxFiles.fileNo, fileNos), eq(taxFiles.year, session.taxYear)))
    for (const f of files) fileMap.set(f.fileNo, f.id)
  }

  return (
    <>
      <div className="dash-page-head">
        <div className="dash-page-head-copy">
          <p className="dash-eyebrow">Workspace</p>
          <h2>Notifications</h2>
        </div>
      </div>
      <div className="dash-card dash-card--flush">
      <table className="dash-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>File</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((n) => {
            const fileId = fileMap.get(n.fileNo)
            return (
              <tr key={n.id}>
                <td>{n.title}</td>
                <td>{n.description}</td>
                <td>{fileId ? <Link href={`/staff/files/${fileId}`}>{n.fileNo}</Link> : n.fileNo || '—'}</td>
                <td>{n.createdAt?.toISOString?.().slice(0, 16).replace('T', ' ')}</td>
              </tr>
            )
          })}
          {!rows.length && (
            <tr>
              <td colSpan={4} className="dash-empty">
                No notifications
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </>
  )
}
