const brand = {
  green: '#0e4132',
  greenDeep: '#0a3226',
  lime: '#82cb05',
  paper: '#f5f4ef',
  ink: '#141414',
  soft: '#5f615a',
  white: '#ffffff',
  line: '#e7e5db',
}

function shell(opts: { preheader: string; title: string; bodyHtml: string; ctaLabel?: string; ctaUrl?: string }) {
  const cta =
    opts.ctaLabel && opts.ctaUrl
      ? `<tr>
          <td style="padding:8px 0 28px;">
            <a href="${opts.ctaUrl}" style="display:inline-block;background:${brand.green};color:${brand.white};text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;padding:14px 22px;border-radius:10px;">
              ${opts.ctaLabel}
            </a>
          </td>
        </tr>`
      : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${opts.title}</title>
</head>
<body style="margin:0;padding:0;background:${brand.paper};color:${brand.ink};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${brand.paper};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${brand.white};border:1px solid ${brand.line};border-radius:20px;overflow:hidden;">
          <tr>
            <td style="background:${brand.greenDeep};padding:22px 28px;">
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:${brand.lime};letter-spacing:-0.02em;">Sientax</div>
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:rgba(245,245,239,0.7);margin-top:4px;letter-spacing:0.08em;text-transform:uppercase;">Simplifying Taxation</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px 8px;">
              <h1 style="margin:0 0 12px;font-family:Helvetica,Arial,sans-serif;font-size:26px;line-height:1.15;letter-spacing:-0.03em;color:${brand.ink};">${opts.title}</h1>
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:${brand.soft};">
                ${opts.bodyHtml}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${cta}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;font-family:Helvetica,Arial,sans-serif;font-size:12.5px;line-height:1.55;color:${brand.soft};border-top:1px solid ${brand.line};">
              If you did not create a Sientax account, you can ignore this email.
              <br />Need help? <a href="mailto:support@sientax.com" style="color:${brand.green};">support@sientax.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function verificationEmailHtml(opts: { firstName: string; verifyUrl: string }) {
  const name = opts.firstName || 'there'
  return shell({
    preheader: 'Confirm your email to activate your Sientax client portal.',
    title: 'Verify your email',
    bodyHtml: `<p style="margin:0 0 14px;">Hi ${name},</p>
      <p style="margin:0 0 14px;">Thanks for creating your Sientax account. Confirm your email address to unlock your client portal, interview sheet, and documents.</p>
      <p style="margin:0 0 18px;">This link expires in <strong>24 hours</strong>.</p>`,
    ctaLabel: 'Verify email address',
    ctaUrl: opts.verifyUrl,
  })
}

export function passwordResetEmailHtml(opts: { resetUrl: string }) {
  return shell({
    preheader: 'Reset your Sientax password.',
    title: 'Reset your password',
    bodyHtml: `<p style="margin:0 0 14px;">We received a request to reset your password.</p>
      <p style="margin:0 0 18px;">This link expires in <strong>1 hour</strong>. If you did not ask for a reset, you can ignore this email.</p>`,
    ctaLabel: 'Choose a new password',
    ctaUrl: opts.resetUrl,
  })
}
