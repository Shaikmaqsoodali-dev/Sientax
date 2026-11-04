import Link from 'next/link'
import { AuthForm } from '@/components/dashboard/auth-form'
import { staffLoginAction } from '@/lib/actions/auth'
import '../../../dashboard.css'

export const metadata = { title: 'Staff Login' }

export default function StaffLoginPage() {
  const year = new Date().getFullYear()
  return (
    <div className="dash-auth">
      <div className="dash-auth-card">
        <p className="dash-brand">Sientax</p>
        <h1>Staff login</h1>
        <p className="dash-muted">Employee and admin access. Separate from client login.</p>
        <AuthForm action={staffLoginAction} submitLabel="Sign in">
          <label>
            Login ID
            <input name="login" required autoComplete="username" />
          </label>
          <label>
            Password
            <input name="password" type="password" required autoComplete="current-password" />
          </label>
          <label>
            Tax year
            <select name="taxYear" defaultValue={year}>
              {[year - 1, year, year + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </AuthForm>
        <p className="dash-auth-links">
          <Link href="/forgot-password?portal=staff">Forgot password?</Link>
          <Link href="/login">Client login →</Link>
        </p>
      </div>
    </div>
  )
}
