import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { assertAdmin } from '@/lib/rbac'
import { createEmployeeAction, listEmployeesAction } from '@/lib/actions/files'
import { AuthForm } from '@/components/dashboard/auth-form'
import { PageHeader } from '@/components/dashboard/page-header'

export default async function EmployeesPage() {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  try {
    assertAdmin(session)
  } catch {
    redirect('/staff')
  }
  const rows = await listEmployeesAction()
  const activeEmployees = rows.filter((e) => e.active && !e.isAdmin)

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Employees"
        description="Create staff logins, then assign client files to them from registration or Change status."
      />
      <div className="dash-stat-row">
        <div className="dash-stat">
          <p className="dash-stat-label">Total staff</p>
          <p className="dash-stat-value">{rows.length}</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-label">Assignable employees</p>
          <p className="dash-stat-value">{activeEmployees.length}</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-label">Admins</p>
          <p className="dash-stat-value">{rows.filter((e) => e.isAdmin).length}</p>
        </div>
      </div>
      <div className="dash-card">
        <h3 style={{ marginTop: 0, fontSize: 18 }}>Register employee</h3>
        <p className="dash-muted">
          Login ID is what they type on <strong>/staff/login</strong> (email works). New employees can receive file assignments after creation.
        </p>
        <AuthForm action={createEmployeeAction} submitLabel="Create employee">
          <div className="dash-grid-2">
            <label>
              First name
              <input name="firstName" required />
            </label>
            <label>
              Last name
              <input name="lastName" required />
            </label>
          </div>
          <div className="dash-grid-2">
            <label>
              Login ID
              <input name="login" required placeholder="name@sientax.com" autoComplete="off" />
            </label>
            <label>
              Email
              <input name="email" type="email" placeholder="Optional if login is an email" />
            </label>
          </div>
          <div className="dash-grid-2">
            <label>
              Phone
              <input name="phone" />
            </label>
            <label>
              Role
              <select name="role" defaultValue="employee">
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
          <label>
            Temporary password
            <input name="password" type="password" required minLength={6} autoComplete="new-password" />
          </label>
        </AuthForm>
      </div>
      <div className="dash-card dash-card--flush">
        <table className="dash-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Login</th>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>
                  {e.firstName} {e.lastName}
                </td>
                <td>
                  <code style={{ fontSize: 13 }}>{e.login}</code>
                </td>
                <td>{e.email || '—'}</td>
                <td>
                  {e.isAdmin ? <span className="dash-pill dash-pill--live">Admin</span> : <span className="dash-pill">Employee</span>}
                </td>
                <td>{e.active ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
