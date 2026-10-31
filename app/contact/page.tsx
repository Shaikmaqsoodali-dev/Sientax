import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Tell us what you need and a Sientax tax expert will reach out to schedule your free consultation.',
}

const steps = [
  {
    number: '01',
    title: 'Book your consultation',
    text: 'Reserve your free initial consultation online or by phone. No commitment, no obligation.',
  },
  {
    number: '02',
    title: 'Get your plan',
    text: 'We take a close look at your situation and map out a tailored tax strategy.',
  },
  {
    number: '03',
    title: 'File with confidence',
    text: 'We handle the work, you get clarity and peace of mind.',
  },
]

export default function ContactPage() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <PageHero
        eyebrow="Free consultation"
        title={
          <>
            Let&apos;s talk about your <em>next step.</em>
          </>
        }
        lead="Tell us a little about what you need. One of our tax experts will reach out to schedule a consultation at a convenient time."
        image={{ src: '/photos/advisor-meeting.jpg', alt: 'A Sientax tax advisor guiding a client through tax questions' }}
      />

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-copy reveal reveal-left">
            <p className="eyebrow">Get in touch</p>
            <h2>
              Clear answers start with a <em>conversation.</em>
            </h2>
            <p>Whether you are filing for yourself, managing a business, or looking for a trusted CPA partner, we are here to help.</p>
            <div className="contact-details">
              <div className="contact-detail">
                <span className="contact-detail-icon"><PhoneIcon /></span>
                <div>
                  <strong>Call us</strong>
                  <span>
                    <a href="tel:+18005550199">+1 (800) 555-0199</a>
                  </span>
                </div>
              </div>
              <div className="contact-detail">
                <span className="contact-detail-icon"><MailIcon /></span>
                <div>
                  <strong>Email us</strong>
                  <span>
                    <a href="mailto:support@sientax.com">support@sientax.com</a>
                  </span>
                </div>
              </div>
              <div className="contact-detail">
                <span className="contact-detail-icon"><MapIcon /></span>
                <div>
                  <strong>Where we work</strong>
                  <span>Serving clients across the United States — by phone, email, and secure portal.</span>
                </div>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="section-head section-head--center reveal reveal-up">
            <p className="eyebrow">Getting started</p>
            <h2>
              A clear path to <em>getting started.</em>
            </h2>
          </div>
          <div className="steps-grid stagger">
            {steps.map((s, i) => (
              <div className={`step-card${i === 0 ? ' step-card--dark' : ''}`} key={s.number}>
                <span className="step-num">{s.number}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="band reveal reveal-scale">
          <Image src="/photos/wmremove-transformed.jpg" alt="Tax planning concepts for individuals and businesses" fill sizes="(max-width: 1240px) 100vw, 60vw" />
          <div className="band-note">
            <span>Let&apos;s talk</span>
            <strong>About your taxes.</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="split-head reveal reveal-left">
              <p className="eyebrow">Find us</p>
              <h2>
                Tax support that <em>travels.</em>
              </h2>
            </div>
            <div className="split-copy reveal reveal-right">
              <p>
                Sientax operates remote-first — our advisors serve clients across the United States
                through secure channels. Whether you are across town or across the country, the same
                senior team is on your file.
              </p>
              <div className="map-frame" style={{ marginTop: 30 }}>
                <iframe
                  title="Sientax tax advisory locations"
                  src="https://www.google.com/maps?q=United%20States&z=2&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="map-caption">
                  <span><strong>Sientax — United States</strong> · Consultations by phone, email, or secure client portal.</span>
                  <Link href="/contact" className="btn btn--green btn--sm">
                    Book now <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1.05.36 2.06.7 2.97a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.92.57 2.97.7A2 2 0 0 1 22 16.92z" /></svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.31 1.31 0 0 1-1.4 0L2 7" /></svg>
  )
}

function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2a2 2 0 0 0 2-2v-7a9 9 0 0 1-9-9V8a9 9 0 0 1 9-9v1a2 2 0 0 0 2 2Z" /><path d="M15 18h-5" /><path d="M17 18h-3" /></svg>
  )
}
