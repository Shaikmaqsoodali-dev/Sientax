'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

export function NewsletterForm() {
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <p className="newsletter-done" role="status">
        <Check size={17} /> You&apos;re on the list — watch your inbox.
      </p>
    )
  }

  return (
    <form
      className="newsletter"
      onSubmit={e => {
        e.preventDefault()
        setDone(true)
      }}
    >
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        required
        placeholder="Type your email"
        autoComplete="email"
      />
      <button className="btn btn--lime" type="submit">
        Subscribe <ArrowRight size={16} />
      </button>
    </form>
  )
}
