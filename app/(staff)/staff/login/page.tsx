import Image from 'next/image'
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
        <Image
          src="/Sientax-Logo-2024-01-1.webp"
          alt="Sientax"
          width={150}
          height={38}
          className="dash-auth-logo"
          priority
        />
        <p className="dash-eyebrow">Staff workspace</p>
        <h1>Sign in</h1>
        <p className="dash-muted">Employee and admin access. Separate from the client portal.</p>
        <AuthForm action={staffLoginAction} submitLabel="Sign in">
          <label>
            Login ID
            <input name="login" required autoComplete="username" placeholder="email or username" />
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
