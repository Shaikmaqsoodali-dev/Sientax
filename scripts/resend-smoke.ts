import { config } from 'dotenv'
config({ path: '.env.local' })

import { Resend } from 'resend'

async function main() {
  const key = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || 'Sientax <noreply@sientax.com>'
  const to = process.argv[2] || 'thesufi.rehan@gmail.com'
  if (!key) throw new Error('RESEND_API_KEY missing')

  const resend = new Resend(key)
  const domains = await resend.domains.list()
  console.log(JSON.stringify({ from, to, domains }, null, 2))

  const result = await resend.emails.send({
    from,
    to,
    subject: 'Sientax Resend smoke test',
    html: '<p>Smoke test from Sientax. If you received this, delivery works.</p>',
  })
  console.log(JSON.stringify({ send: result }, null, 2))
  if (result.error) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
