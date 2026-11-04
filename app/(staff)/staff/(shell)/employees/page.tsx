import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { assertAdmin } from '@/lib/rbac'
import { createEmployeeAction, listEmployeesAction } from '@/lib/actions/files'
import { AuthForm } from '@/components/dashboard/auth-form'

export default async function EmployeesPage() {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  try {
    assertAdmin(session)
  } catch {
    redirect('/staff')
  }
  const rows = await listEmployeesAction()

  return (
    <div className="dash-card">
      <h2 style={{ marginTop: 0, fontSize: 22 }}>Employee registration</h2>
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
            <input name="login" required />
          </label>
          <label>
            Email
            <input name="email" type="email" />
          </label>
        </div>
        <label>
          Phone
          <input name="phone" />
        </label>
        <label>
          Password
          <input name="password" type="password" required minLength={6} />
        </label>
      </AuthForm>
      <h3 style={{ marginTop: 28 }}>Employees</h3>
      <table className="dash-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Login</th>
            <th>Email</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>
                {e.firstName} {e.lastName}
              </td>
              <td>{e.login}</td>
              <td>{e.email}</td>
              <td>{e.isAdmin ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
