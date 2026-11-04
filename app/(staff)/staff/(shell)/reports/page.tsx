import Link from 'next/link'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { assertAdmin } from '@/lib/rbac'
import { db, taxFiles, clients, employees } from '@/db'

export default async function ReportsPage() {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  try {
    assertAdmin(session)
  } catch {
    redirect('/staff')
  }

  const rows = await db
    .select({
      id: taxFiles.id,
      fileNo: taxFiles.fileNo,
      stage: taxFiles.stage,
      substage: taxFiles.substage,
      firstName: clients.firstName,
      lastName: clients.lastName,
      empFirst: employees.firstName,
      empLast: employees.lastName,
    })
    .from(taxFiles)
    .innerJoin(clients, eq(taxFiles.clientId, clients.id))
    .leftJoin(employees, eq(taxFiles.empId, employees.id))
    .where(eq(taxFiles.year, session.taxYear))

  return (
    <div className="dash-card">
      <h2 style={{ marginTop: 0, fontSize: 22 }}>Year report · {session.taxYear}</h2>
      <table className="dash-table">
        <thead>
          <tr>
            <th>File</th>
            <th>Client</th>
            <th>Employee</th>
            <th>Stage</th>
            <th>Substage</th>
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
              <td>
                {r.empFirst} {r.empLast}
              </td>
              <td>{r.stage}</td>
              <td>{r.substage}</td>
              <td>
                <Link href={`/staff/files/${r.id}`}>Open</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
