import Link from 'next/link'

export const metadata = { title: 'Verification failed' }

export default async function VerifyEmailFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const sp = await searchParams
  const error = sp.error || 'This verification link is invalid or has expired.'

  return (
    <div className="dash-auth">
      <div className="dash-auth-card">
        <p className="dash-eyebrow">Client portal</p>
        <h1>Verification failed</h1>
        <p className="dash-error" style={{ marginBottom: 18 }} role="alert">
          {error}
        </p>
        <p className="dash-auth-links" style={{ marginTop: 0 }}>
          <Link href="/login" className="dash-btn" style={{ textDecoration: 'none' }}>
            Back to log in
          </Link>
          <Link href="/signup/check-email">Resend email</Link>
        </p>
      </div>
    </div>
  )
}
