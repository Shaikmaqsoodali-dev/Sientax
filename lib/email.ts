import { Resend } from 'resend'

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.info('[email:dev]', opts.to, opts.subject)
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
  return result
}
