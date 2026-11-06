import Link from 'next/link'
import { AuthForm } from '@/components/dashboard/auth-form'
import { clientLoginAction } from '@/lib/actions/auth'

export const metadata = { title: 'Log in' }

export default function ClientLoginPage() {
  return (
    <div className="dash-auth">
      <div className="dash-auth-split">
        <aside className="dash-auth-aside">
          <div>
            <p className="dash-eyebrow" style={{ color: 'var(--lime)' }}>
              Client portal
            </p>
            <h2>Your tax file, in one place</h2>
            <p>Sign in to continue your interview, upload documents, and track filing progress.</p>
          </div>
          <ul className="dash-auth-points">
            <li>Secure access to your current-year tax file</li>
            <li>Interview sheet and document uploads</li>
            <li>Estimates, invoices, and Zelle payment status</li>
          </ul>
        </aside>
        <div className="dash-auth-panel">
          <h1 style={{ fontSize: 30, margin: '0 0 8px' }}>Log in</h1>
          <p className="dash-muted">Use the email and password for your Sientax client account.</p>
          <AuthForm action={clientLoginAction} submitLabel="Sign in">
            <label>
              Email
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              Password
              <input name="password" type="password" required autoComplete="current-password" />
            </label>
          </AuthForm>
          <p className="dash-auth-links">
            <Link href="/forgot-password">Forgot password?</Link>
            <Link href="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
