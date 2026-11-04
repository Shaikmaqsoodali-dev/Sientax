import Link from 'next/link'
import { AuthForm } from '@/components/dashboard/auth-form'
import { clientLoginAction } from '@/lib/actions/auth'

export const metadata = { title: 'Client Login' }

export default function ClientLoginPage() {
  return (
    <div className="dash-auth">
      <div className="dash-auth-card">
        <p className="dash-brand">Sientax</p>
        <h1>Client login</h1>
        <p className="dash-muted">Access your tax file, interview, and invoices.</p>
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
        <p className="dash-auth-links">
          <Link href="/staff/login">Staff login →</Link>
        </p>
      </div>
    </div>
  )
}
