import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

const explore: [string, string][] = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['How we work', '/process'],
  ['FAQ', '/faq'],
  ['CPA Hub', '/cpa-collaboration'],
  ['Contact', '/contact'],
]

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-main reveal reveal-up">
        <div>
          <Link href="/" className="footer-logo" aria-label="Sientax home">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sientax-Logo-2024-01-1-eWrlrPsSyJNiyMZDG3M4MtQTNfSxYs.webp"
              alt="Sientax"
              width={157}
              height={39}
              loading="lazy"
              decoding="async"
            />
          </Link>
          <p>Clear, reliable tax and accounting support for individuals and businesses across the USA.</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Explore</strong>
            {explore.map(([label, href]) => (
              <Link href={href} key={href}>{label}</Link>
            ))}
          </div>
          <div>
            <strong>Get in touch</strong>
            <a href="tel:+18005550199"><Phone size={14} /> +1 (800) 555-0199</a>
            <a href="mailto:support@sientax.com"><Mail size={14} /> support@sientax.com</a>
            <span><MapPin size={14} /> United States</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2024 Sientax. All rights reserved.</span>
        <span><a href="#">Privacy Policy</a><a href="#">Refund Policy</a></span>
      </div>
    </footer>
  )
}
