import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { CtaBanner } from '@/components/cta-banner'
import { FaqAccordion, type FaqItem } from '@/components/faq-accordion'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about Sientax services, consultations, secure document submission, and our experience.',
}

const faqs: FaqItem[] = [
  ['What services does Sientax provide?', 'Sientax offers U.S. tax filing, tax audit assistance, amendments, payroll services, and personalized tax planning for individuals and businesses.'],
  ["Who can benefit from Sientax's services?", 'Sientax is ideal for individuals, small businesses, freelancers, and anyone needing tax support in the U.S.'],
  ['How do I schedule a consultation?', "You can book a consultation via Sientax's website, where they offer a free initial consultation."],
  ['Is there a secure way to submit documents?', 'Yes, Sientax provides a secure client portal for document submissions and communications.'],
  ['How experienced is the team?', "With over 30 years of experience, Sientax's consultants are well-versed in complex tax matters."],
  ['Can you represent me in a tax audit?', 'Yes. Our experts handle communication with the IRS on your behalf, manage documentation, and guide you through every stage of the audit process.'],
  ['Do you work with CPA and accounting firms?', 'Yes. Our CPA Collaboration Hub lets accounting professionals extend their capacity with a reliable tax advisory partner. Learn more on the CPA Hub page.'],
  ['What do I need to get started?', 'To get started, we typically ask clients to share their basic financial information, prior-year tax returns if available, and supporting documents such as W-2s and 1099s. We will guide you through any missing information step by step.'],
  ['Can you file taxes in any state?', 'Yes. We are authorized to electronically file tax returns across all 50 U.S. states, handling both federal and state obligations together.'],
  ['What happens if my previous return had an error?', 'If a prior return contains errors, we can file an accurate amendment. Our team reviews the original return, identifies what needs correcting, and prepares the amended return with clear documentation.'],
  ['Do you support payroll beyond filing?', 'Yes. Our payroll service covers ongoing administration, compliance support, and year-end forms such as W-2s and 941s.'],
  ['Is the initial consultation really free?', 'Yes. Every new engagement starts with a free initial consultation, where we assess your situation and outline how we can help.'],
]

const contacts = [
  {
    title: 'Call us',
    text: 'Speak with a tax advisor directly about your situation.',
    action: 'Start a call',
    href: 'tel:+18005550199',
    icon: 'phone',
  },
  {
    title: 'Email us',
    text: 'Send your questions and documents safely through our secure portal.',
    action: 'Send a message',
    href: 'mailto:support@sientax.com',
    icon: 'mail',
  },
  {
    title: 'Book online',
    text: 'Pick a time that suits you and secure your free consultation.',
    action: 'Book a consultation',
    href: '/contact',
    icon: 'calendar',
  },
]

export default function FaqPage() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <PageHero
        eyebrow="Your questions answered"
        title={
          <>
            Get informed <em>now.</em>
          </>
        }
        lead="Answers to the questions we hear most often. Can’t find what you’re looking for? Get in touch with our team and we will gladly help out."
        image={{ src: '/photos/finance-analytics.jpg', alt: 'Financial reports and analytics on a desk' }}
      />

      <section className="section section--paper">
        <div className="faq-block">
          <div className="container">
            <div className="faq-intro-block">
              <p className="eyebrow">FAQ</p>
              <h2>
                Frequently asked <em>questions.</em>
              </h2>
              <p>Answers to the questions we hear most often about Sientax services, consultations, documents, and experience.</p>
            </div>
            <FaqAccordion items={faqs} columns={2} defaultOpen={0} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="band reveal reveal-scale">
          <Image src="/photos/payroll-concept.jpg" alt="Payroll records and tax documents organised on a desk" fill sizes="(max-width: 1240px) 100vw, 60vw" />
          <div className="band-note">
            <span>Clear answers</span>
            <strong>No guesswork.</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--center reveal reveal-up">
            <p className="eyebrow">Still have questions</p>
            <h2>
              We&apos;re here when you <em>need us.</em>
            </h2>
            <p>Every financial situation is different — a human advisor is the fastest way to get a useful answer.</p>
          </div>
          <div className="contact-strip stagger">
            {contacts.map(c => (
              <a href={c.href} className="strip-card" key={c.title}>
                <span className="check-icon">{c.icon === 'phone' ? <PhoneIcon /> : c.icon === 'mail' ? <MailIcon /> : <CalendarIcon />}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <span className="strip-action">
                  {c.action} <ArrowRight size={15} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Ready when you are"
        title={<>Take the next step toward <em>financial clarity.</em></>}
        label="Let&apos;s get in touch"
        href="/contact"
      />

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

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
  )
}
