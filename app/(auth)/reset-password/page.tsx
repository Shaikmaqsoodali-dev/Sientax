import Link from 'next/link'
import { AuthForm } from '@/components/dashboard/auth-form'
import { resetPasswordAction } from '@/lib/actions/auth'

export const metadata = { title: 'Reset password' }

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; portal?: string }>
}) {
  const sp = await searchParams
  const portal = sp.portal === 'staff' ? 'staff' : 'client'

  return (
    <div className="dash-auth">
      <div className="dash-auth-card">
        <p className="dash-eyebrow">{portal === 'staff' ? 'Staff' : 'Client'}</p>
        <h1>Reset password</h1>
        <p className="dash-muted">Choose a new password for your account.</p>
        <AuthForm action={resetPasswordAction} submitLabel="Update password">
          <input type="hidden" name="token" value={sp.token || ''} />
          <input type="hidden" name="portal" value={portal} />
          <label>
            New password
            <input name="password" type="password" required minLength={6} autoComplete="new-password" />
          </label>
        </AuthForm>
        <p className="dash-auth-links">
          <Link href={portal === 'staff' ? '/staff/login' : '/login'}>Back to log in</Link>
        </p>
      </div>
    </div>
  )
}
