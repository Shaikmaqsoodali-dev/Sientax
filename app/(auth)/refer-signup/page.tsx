import Link from 'next/link'
import { AuthForm } from '@/components/dashboard/auth-form'
import { referSignupAction } from '@/lib/actions/auth'

export const metadata = { title: 'Referrer signup' }

export default function ReferSignupPage() {
  return (
    <div className="dash-auth">
      <div className="dash-auth-card">
        <p className="dash-brand">Sientax</p>
        <h1>Referrer signup</h1>
        <p className="dash-muted">Choose a referral code you will share with clients.</p>
        <AuthForm action={referSignupAction} submitLabel="Create referrer account">
          <label>
            First name
            <input name="firstName" required />
          </label>
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
            Referral code
            <input name="code" required />
          </label>
          <label>
            Password
            <input name="password" type="password" required minLength={6} />
          </label>
        </AuthForm>
        <p className="dash-auth-links">
          <Link href="/login">Already registered?</Link>
        </p>
      </div>
    </div>
  )
}
