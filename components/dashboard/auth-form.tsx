'use client'

import { useState, useTransition } from 'react'

type Props = {
  action: (
    formData: FormData,
  ) => Promise<{ ok: true; message?: string; [key: string]: unknown } | { ok: false; error: string } | void>
  children: React.ReactNode
  submitLabel: string
}

function explainError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err || '')
  if (/failed to find server action|was not found on the server/i.test(msg)) {
    return 'This page is out of date after a deploy. Refresh once, then try again.'
  }
  return msg || 'Something went wrong'
}

export function AuthForm({ action, children, submitLabel }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, start] = useTransition()

  return (
    <form
      className="dash-form"
      action={(fd) => {
        setError(null)
        setMessage(null)
        start(async () => {
          try {
            const res = await action(fd)
            if (res && 'ok' in res) {
              if (res.ok === false) setError(res.error)
              else if (res.message) setMessage(res.message)
            }
          } catch (err) {
            // Re-throw Next.js redirects
            if (err && typeof err === 'object' && 'digest' in err) throw err
            setError(explainError(err))
          }
        })
      }}
    >
      {children}
      {error && (
        <p className="dash-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="dash-success" role="status">
          {message}
        </p>
      )}
      <button type="submit" disabled={pending} className="dash-btn" style={{ width: '100%' }}>
        {pending ? 'Please wait…' : submitLabel}
      </button>
    </form>
  )
}
