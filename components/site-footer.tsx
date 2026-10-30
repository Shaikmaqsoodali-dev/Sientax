import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { NewsletterForm } from '@/components/newsletter-form'

const company: [string, string][] = [
  ['About us', '/about'],
  ['How we work', '/process'],
  ['CPA Hub', '/cpa-collaboration'],
  ['FAQ', '/faq'],
  ['Contact', '/contact'],
]

const services: [string, string][] = [
  ['US Individual Tax Filing', '/services/us-individual-tax-filing'],
  ['Tax Audit Representation', '/services/tax-audit-representation'],
  ['Amendment Filing', '/services/amendment-filing'],
  ['Corporate Tax', '/services/corporate-tax'],
  ['Payroll Service', '/services/payroll-service'],
]

const resources: [string, string][] = [
  ['Getting started', '/process'],
  ['Common questions', '/faq'],
  ['Free consultation', '/contact'],
  ['Audit support', '/services/tax-audit-representation'],
]

const social: [string, string][] = [
  ['Instagram', '#'],
  ['Facebook', '#'],
  ['LinkedIn', '#'],
  ['X / Twitter', '#'],
  ['YouTube', '#'],
]

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top reveal reveal-up">
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="Sientax home">
              <img
                src="/Sientax-Logo-2024-01-1.webp"
                alt="Sientax"
                width={157}
                height={39}
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p>
              Clear, reliable tax and accounting support for individuals and businesses across the
              USA — from first consultation to filing.
            </p>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <strong>Company</strong>
              {company.map(([label, href]) => (
                <Link href={href} key={href}>{label}</Link>
              ))}
            </div>
            <div className="footer-col">
              <strong>Services</strong>
              {services.map(([label, href]) => (
                <Link href={href} key={href}>{label}</Link>
              ))}
            </div>
            <div className="footer-col">
              <strong>Resources</strong>
              {resources.map(([label, href]) => (
                <Link href={href} key={href}>{label}</Link>
              ))}
            </div>
            <div className="footer-col">
              <strong>Social Media</strong>
              {social.map(([label, href]) => (
                <a href={href} key={label} rel={href === '#' ? 'noopener noreferrer' : undefined}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-news reveal reveal-up">
          <h2>Stay financially informed.</h2>
          <NewsletterForm />
        </div>

        <div className="footer-bottom">
          <span>© 2024 Sientax. All rights reserved.</span>
          <span>
            <a href="#">Privacy Policy</a>
            <a href="#">Refund Policy</a>
            <Link href="/contact">Contact</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
