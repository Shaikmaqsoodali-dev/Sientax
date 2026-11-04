import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { listStaffFiles } from '@/lib/actions/files'
import { byCode } from '@/lib/pipeline'

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
    <div className="dash-card">
      <h2 style={{ marginTop: 0, fontSize: 22 }}>{def?.label || 'All files'} · {session.taxYear}</h2>
      <form className="dash-search">
        {code ? <input type="hidden" name="a" value={code} /> : null}
        <input name="q" placeholder="Search file no, name, email, phone" defaultValue={sp.q || ''} />
        <button className="dash-btn" type="submit">
          Search
        </button>
      </form>
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
              <td>{r.fileNo}</td>
              <td>
                {r.firstName} {r.lastName}
              </td>
              <td>{r.email}</td>
              <td>{r.phone}</td>
              <td>
                {r.stage} / {r.substage}
              </td>
              <td>
                <Link href={`/staff/files/${r.id}`}>Open</Link>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={6}>No files in this queue</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
