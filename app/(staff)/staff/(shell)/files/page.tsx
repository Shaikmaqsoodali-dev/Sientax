import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { listStaffFiles } from '@/lib/actions/files'
import { byCode } from '@/lib/pipeline'
import { PageHeader } from '@/components/dashboard/page-header'

export default async function StaffFilesPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; q?: string }>
}) {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  const sp = await searchParams
  const code = sp.a ? Number(sp.a) : undefined
  const def = code ? byCode(code) : undefined
  const rows = await listStaffFiles({
    year: session.taxYear,
    empId: session.employeeId,
    isAdmin: session.role === 'admin',
    stageCode: code,
    q: sp.q,
  })

  return (
    <>
      <PageHeader
        eyebrow={def?.stage || 'Files'}
        title={`${def?.label || 'All files'} · ${session.taxYear}`}
        description={
          def
            ? `${rows.length} file${rows.length === 1 ? '' : 's'} in this queue.`
            : 'Search across file number, client name, email, or phone.'
        }
      />
      <div className="dash-card dash-card--flush">
        <div style={{ padding: '16px 18px 0' }}>
          <form className="dash-search">
            {code ? <input type="hidden" name="a" value={code} /> : null}
            <input name="q" placeholder="Search file no, name, email, phone" defaultValue={sp.q || ''} />
            <button className="dash-btn" type="submit">
              Search
            </button>
          </form>
        </div>
        <table className="dash-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Client</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Stage</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong>{r.fileNo}</strong>
                </td>
                <td>
                  {r.firstName} {r.lastName}
                </td>
                <td>{r.email}</td>
                <td>{r.phone}</td>
                <td>
                  <span className="dash-pill">
                    {r.stage} / {r.substage}
                  </span>
                </td>
                <td>
                  <Link href={`/staff/files/${r.id}`}>Open</Link>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="dash-empty">
                  No files in this queue
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
