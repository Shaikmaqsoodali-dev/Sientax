import Link from 'next/link'
import { verifyEmailAction } from '@/lib/actions/auth'

export const metadata = { title: 'Verify email' }

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const sp = await searchParams
  // On success this redirects into the client dashboard with a session.
  const result = sp.token
    ? await verifyEmailAction(sp.token)
    : { ok: false as const, error: 'Missing verification token' }

  return (
    <div className="dash-auth">
      <div className="dash-auth-card">
        <p className="dash-eyebrow">Client portal</p>
        <h1>Verification failed</h1>
        <p className="dash-error" style={{ marginBottom: 18 }}>
          {result.ok ? 'Something went wrong.' : result.error}
        </p>
        <p className="dash-auth-links" style={{ marginTop: 0 }}>
          <Link href="/login" className="dash-btn" style={{ textDecoration: 'none' }}>
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  )
}
