import Link from 'next/link'
import { AuthForm } from '@/components/dashboard/auth-form'
import { resendVerificationAction } from '@/lib/actions/auth'

export const metadata = { title: 'Check your email' }

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const sp = await searchParams
  const email = sp.email || ''

  return (
    <div className="dash-auth">
      <div className="dash-auth-card">
        <p className="dash-eyebrow">Almost there</p>
        <h1>Check your email</h1>
        <p className="dash-muted">
          We sent a verification link{email ? ` to ` : '.'}
          {email ? <strong>{email}</strong> : null}
          {email ? '.' : ''} Open it to activate your client portal.
        </p>
        <AuthForm action={resendVerificationAction} submitLabel="Resend verification email">
          <label>
            Email
            <input name="email" type="email" required defaultValue={email} autoComplete="email" />
          </label>
        </AuthForm>
        <p className="dash-auth-links">
          <Link href="/login">Back to log in</Link>
        </p>
      </div>
    </div>
  )
}
