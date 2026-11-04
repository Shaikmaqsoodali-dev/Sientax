import Link from 'next/link'
import { AuthForm } from '@/components/dashboard/auth-form'
import { forgotPasswordAction } from '@/lib/actions/auth'

export const metadata = { title: 'Forgot password' }

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ portal?: string }>
}) {
  const sp = await searchParams
  const portal = sp.portal === 'staff' ? 'staff' : 'client'

  return (
    <div className="dash-auth">
      <div className="dash-auth-card">
        <p className="dash-eyebrow">{portal === 'staff' ? 'Staff' : 'Client'}</p>
        <h1>Forgot password</h1>
        <p className="dash-muted">We will email a reset link if an account exists.</p>
        <AuthForm action={forgotPasswordAction} submitLabel="Send reset link">
          <input type="hidden" name="portal" value={portal} />
          <label>
            Email
            <input name="email" type="email" required autoComplete="email" />
          </label>
        </AuthForm>
        <p className="dash-auth-links">
          <Link href={portal === 'staff' ? '/staff/login' : '/login'}>Back to log in</Link>
        </p>
      </div>
    </div>
  )
}
