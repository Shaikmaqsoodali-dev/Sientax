import Link from 'next/link'
import { AuthForm } from '@/components/dashboard/auth-form'
import { signupAction } from '@/lib/actions/auth'

export const metadata = { title: 'Sign up' }

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const sp = await searchParams

  return (
    <div className="dash-auth">
      <div className="dash-auth-split dash-auth-wide" style={{ width: 'min(980px, 100%)' }}>
        <aside className="dash-auth-aside">
          <div>
            <p className="dash-eyebrow" style={{ color: 'var(--lime)' }}>
              Get started
            </p>
            <h2>Create your client account</h2>
            <p>We open a tax file for the current year and email you a verification link to activate access.</p>
          </div>
          <ul className="dash-auth-points">
            <li>No consultant picker — we assign a specialist for you</li>
            <li>Verify your email before the first sign-in</li>
            <li>Then complete interview and document upload</li>
          </ul>
        </aside>
        <div className="dash-auth-panel">
          <h1 style={{ fontSize: 30, margin: '0 0 8px' }}>Sign up</h1>
          <p className="dash-muted">Takes about a minute. Required fields are marked by the browser.</p>
          <AuthForm action={signupAction} submitLabel="Create account">
            <input type="hidden" name="ref" value={sp.ref || ''} />
            <div className="dash-grid-2">
              <label>
                First name
                <input name="firstName" required autoComplete="given-name" />
              </label>
              <label>
                Middle name
                <input name="middleName" autoComplete="additional-name" />
              </label>
            </div>
            <label>
              Last name
              <input name="lastName" required autoComplete="family-name" />
            </label>
            <label>
              Email
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              Phone
              <input name="phone" type="tel" required autoComplete="tel" />
            </label>
            <label>
              Password
              <input name="password" type="password" required minLength={6} autoComplete="new-password" />
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
          </AuthForm>
          <p className="dash-auth-links">
            <Link href="/login">Already have an account?</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
