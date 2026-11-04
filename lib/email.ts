import { Resend } from 'resend'

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.info('[email:dev]', opts.to, opts.subject)
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Email is not configured (RESEND_API_KEY missing).')
    }
    return { id: 'dev', skipped: true as const }
  }

  const resend = new Resend(key)
  const from = process.env.EMAIL_FROM || 'Sientax <noreply@sientax.com>'
  const result = await resend.emails.send({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  })

  if (result.error) {
    const msg = result.error.message || 'Failed to send email'
    console.error('[email:resend]', result.error)
    throw new Error(msg)
  }

  return { id: result.data?.id || 'sent', skipped: false as const }
}
