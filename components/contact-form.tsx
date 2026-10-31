'use client'

import { useState } from 'react'
import { ArrowRight, Check, User, Mail, Phone, Briefcase, MessageSquare } from 'lucide-react'

const services = [
  'U.S. Individual Tax Filing',
  'Tax Audit Representation',
  'Amendment Filing',
  'Corporate Tax',
  'Payroll Service',
  'Personal tax planning',
  'Business tax planning',
  'Something else',
]

export function ContactForm() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="contact-form form-success">
        <span className="success-icon">
          <Check size={24} />
        </span>
        <p className="eyebrow">Message received</p>
        <h3>Thank you — we&apos;ll be in touch.</h3>
        <p>
          Your message is in. One of our tax experts will reach out shortly to schedule your free
          consultation at a time that works for you.
        </p>
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
      <div className="form-row">
        <label className="field">
          <span className="field-icon"><User size={15} /></span>
          Full name *
          <input required name="name" placeholder="Your full name" />
        </label>
        <label className="field">
          <span className="field-icon"><Mail size={15} /></span>
          Email address *
          <input required type="email" name="email" placeholder="you@example.com" />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span className="field-icon"><Phone size={15} /></span>
          Phone number
          <input type="tel" name="phone" placeholder="+1 (800) 555-0199" />
        </label>
        <label className="field">
          <span className="field-icon"><Briefcase size={15} /></span>
          Service *
          <select required name="service" defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            {services.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span className="field-icon"><MessageSquare size={15} /></span>
        How can we help? *
        <textarea required name="message" rows={5} placeholder="Tell us briefly what you need help with." />
      </label>
      <p className="form-note">Please do not include sensitive financial information.</p>
      <label className="consent">
        <input type="checkbox" required name="consent" />
        I understand and agree to the privacy policy.
      </label>
      <button className="btn btn--green" type="submit">
        Send inquiry <ArrowRight size={17} />
      </button>
    </form>
  )
}
