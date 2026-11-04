import Link from 'next/link'
import { AuthForm } from '@/components/dashboard/auth-form'
import { listConsultants, signupAction } from '@/lib/actions/auth'

export const metadata = { title: 'Sign up' }

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const sp = await searchParams
  const consultants = await listConsultants().catch(() => [])

  return (
    <div className="dash-auth">
      <div className="dash-auth-card dash-auth-wide">
        <p className="dash-brand">Sientax</p>
        <h1>Create your account</h1>
        <p className="dash-muted">Start a new tax file for the current year.</p>
        <AuthForm action={signupAction} submitLabel="Create account">
          <input type="hidden" name="ref" value={sp.ref || ''} />
          <div className="dash-grid-2">
            <label>
              First name
              <input name="firstName" required />
            </label>
            <label>
              Middle name
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
            Password
            <input name="password" type="password" required minLength={6} />
          </label>
          <div className="dash-grid-2">
            <label>
              Time zone
              <select name="timeZone" defaultValue="PT">
                <option value="PT">Pacific (PT)</option>
                <option value="MT">Mountain (MT)</option>
                <option value="CT">Central (CT)</option>
                <option value="ET">Eastern (ET)</option>
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
          <label>
            Tax consultant
            <select name="empId" required defaultValue="">
              <option value="" disabled>
                Select consultant
              </option>
              {consultants.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </label>
        </AuthForm>
        <p className="dash-auth-links">
          <Link href="/login">Already have an account?</Link>
        </p>
      </div>
    </div>
  )
}
