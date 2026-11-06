import Link from 'next/link'
import { redirect } from 'next/navigation'
import { desc, eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { listEmployeesAction, staffRegisterClientAction } from '@/lib/actions/files'
import { AuthForm } from '@/components/dashboard/auth-form'
import { PageHeader } from '@/components/dashboard/page-header'
import { isAdmin } from '@/lib/rbac'
import { db, taxFiles, clients } from '@/db'

export default async function StaffHomePage() {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  const employees = await listEmployeesAction()
  const assignable = employees.filter((e) => e.active && !e.isAdmin && e.login.toLowerCase() !== 'admin')

  const recentQuery = db
    .select({
      id: taxFiles.id,
      fileNo: taxFiles.fileNo,
      stage: taxFiles.stage,
      substage: taxFiles.substage,
      empId: taxFiles.empId,
      firstName: clients.firstName,
      lastName: clients.lastName,
      email: clients.email,
      createdAt: taxFiles.createdAt,
    })
    .from(taxFiles)
    .innerJoin(clients, eq(clients.id, taxFiles.clientId))
    .orderBy(desc(taxFiles.createdAt))
    .limit(8)

  const recent = isAdmin(session)
    ? await recentQuery
    : await db
        .select({
          id: taxFiles.id,
          fileNo: taxFiles.fileNo,
          stage: taxFiles.stage,
          substage: taxFiles.substage,
          empId: taxFiles.empId,
          firstName: clients.firstName,
          lastName: clients.lastName,
          email: clients.email,
          createdAt: taxFiles.createdAt,
        })
        .from(taxFiles)
        .innerJoin(clients, eq(clients.id, taxFiles.clientId))
        .where(eq(taxFiles.empId, session.employeeId || 0))
        .orderBy(desc(taxFiles.createdAt))
        .limit(8)

  return (
    <>
      <PageHeader
        eyebrow={`${session.taxYear} workspace`}
        title="Register client"
        description={
          isAdmin(session)
            ? 'Create a client file and assign it to an employee. Employees only see files assigned to them.'
            : 'Create a new file in Interview Pending. It will be assigned to you.'
        }
        actions={
          isAdmin(session) ? (
            <Link href="/staff/employees" className="dash-btn secondary">
              Manage employees
            </Link>
          ) : null
        }
      />

      {!assignable.length && isAdmin(session) ? (
        <p className="dash-error" role="alert">
          No assignable employees yet. Create an employee under Employees before registering clients.
        </p>
      ) : null}

      <div className="dash-card">
        <AuthForm
          action={async (fd) => {
            'use server'
            const res = await staffRegisterClientAction(fd)
            if (res.ok && 'fileId' in res) redirect(`/staff/files/${res.fileId}`)
            return res
          }}
          submitLabel="Create file"
        >
          <div className="dash-grid-2">
            <label>
              First name
              <input name="firstName" required />
            </label>
            <label>
              Middle
              <input name="middleName" />
            </label>
          </div>
          <label>
            Last name
            <input name="lastName" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Phone
            <input name="phone" required />
          </label>
          <label>
            Temporary password
            <input name="password" type="password" required minLength={6} />
          </label>
          <div className="dash-grid-2">
            <label>
              Time zone
              <select name="timeZone" defaultValue="PT">
                <option value="PT">PT</option>
                <option value="MT">MT</option>
                <option value="CT">CT</option>
                <option value="ET">ET</option>
              </select>
            </label>
            <label>
              Preferred contact
              <select name="pref" defaultValue="morning">
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </label>
          </div>
          {isAdmin(session) ? (
            <label>
              Assign employee
              <select name="empId" required defaultValue="">
                <option value="" disabled>
                  Select employee
                </option>
                {assignable.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName} ({e.login})
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <input type="hidden" name="empId" value={session.employeeId || ''} />
          )}
        </AuthForm>
      </div>

      <div className="dash-card dash-card--flush">
        <div style={{ padding: '16px 18px 0' }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>{isAdmin(session) ? 'Recent registrations' : 'Your recent files'}</h3>
        </div>
        <table className="dash-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Client</th>
              <th>Email</th>
              <th>Stage</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong>{r.fileNo}</strong>
                </td>
                <td>
                  {r.firstName} {r.lastName}
                </td>
                <td>{r.email}</td>
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
            {!recent.length && (
              <tr>
                <td colSpan={5} className="dash-empty">
                  No files yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
