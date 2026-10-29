import type { Metadata } from 'next'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Tell us what you need and a Sientax tax expert will reach out to schedule your free consultation.',
}

export default function ContactPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="inner-hero">
        <p className="eyebrow">Free consultation</p>
        <h1>Let&apos;s talk about your <em>next step.</em></h1>
        <p>Tell us a little about what you need. One of our tax experts will reach out to schedule a consultation at a convenient time.</p>
      </section>
      <section className="contact-grid section">
        <div className="reveal reveal-left">
          <p className="eyebrow">Get in touch</p>
          <h2>Clear answers start with a <em>conversation.</em></h2>
          <p>Whether you are filing for yourself, managing a business, or looking for a trusted CPA partner, we are here to help.</p>
          <div className="contact-details">
            <span>support@sientax.com</span>
            <span>+1 (800) 555-0199</span>
            <span>United States</span>
          </div>
        </div>
        <ContactForm />
      </section>
      <section className="media-band tight">
        <div className="page-image reveal reveal-scale">
          <Image src="/photos/office-space.jpg" alt="A bright modern office where Sientax advisors work with clients" fill sizes="(max-width: 1240px) 100vw, 1180px" />
          <div className="hero-note"><span>05</span><p>Remote-friendly.<br /><strong>Always available.</strong></p></div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
