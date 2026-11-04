import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { listEmployeesAction, staffRegisterClientAction } from '@/lib/actions/files'
import { AuthForm } from '@/components/dashboard/auth-form'
import { PageHeader } from '@/components/dashboard/page-header'
import { isAdmin } from '@/lib/rbac'

export default async function StaffHomePage() {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  const employees = await listEmployeesAction()

  return (
    <>
      <PageHeader
        eyebrow={`${session.taxYear} workspace`}
        title="Register client"
        description="Creates a new file in Interview Pending and assigns a consultant."
      />
      <div className="dash-card" style={{ maxWidth: 720 }}>
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
                  Select
                </option>
                {employees
                  .filter((e) => e.login.toLowerCase() !== 'admin')
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName}
                    </option>
                  ))}
              </select>
            </label>
          ) : (
            <input type="hidden" name="empId" value={session.employeeId || ''} />
          )}
        </AuthForm>
      </div>
    </>
  )
}
