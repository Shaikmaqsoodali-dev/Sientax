'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

export function ContactForm() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="form-success">
        <p className="eyebrow">Message received</p>
        <h3>Thank you. We&apos;ll be in touch.</h3>
        <p>We have your information and will follow up soon.</p>
      </div>
    )
  }

  return (
    <form
      className="contact-form reveal reveal-right"
      onSubmit={e => {
        e.preventDefault()
        setSent(true)
      }}
    >
      <label>Full name<input required name="name" /></label>
      <label>Email address<input required type="email" name="email" /></label>
      <label>Phone number<input required name="phone" /></label>
      <label>How can we help?<textarea required name="message" rows={5} /></label>
      <label className="checkbox"><input type="checkbox" required /> I understand and agree to the privacy policy.</label>
      <button className="button button-dark" type="submit">Send inquiry <ArrowUpRight size={17} /></button>
    </form>
  )
}
