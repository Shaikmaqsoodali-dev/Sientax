'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  action: (
    formData: FormData,
  ) => Promise<{ ok: true; [key: string]: unknown } | { ok: false; error: string } | void>
  children: React.ReactNode
  submitLabel: string
}

export function AuthForm({ action, children, submitLabel }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  return (
    <form
      className="dash-form"
      action={(fd) => {
        setError(null)
        start(async () => {
          try {
            const res = await action(fd)
            if (res && 'ok' in res && res.ok === false) setError(res.error)
          } catch (err) {
            // Re-throw Next.js redirects
            if (err && typeof err === 'object' && 'digest' in err) throw err
            setError(err instanceof Error ? err.message : 'Something went wrong')
          }
        })
      }}
    >
      {children}
      {error && <p className="dash-error">{error}</p>}
      <Button type="submit" disabled={pending} className="w-full h-10 bg-[var(--green)] text-white hover:bg-[var(--green-deep)]">
        {pending ? 'Please wait…' : submitLabel}
      </Button>
    </form>
  )
}
