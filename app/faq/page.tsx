import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
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
]

export default function FaqPage() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <section className="inner-hero">
        <p className="eyebrow">Your questions answered</p>
        <h1>Get informed <em>now.</em></h1>
        <p>Answers to the questions we hear most often. Can&apos;t find what you&apos;re looking for? Get in touch with our team and we will gladly help out.</p>
      </section>

      <section className="faq section">
        <div className="faq-intro reveal reveal-left">
          <p className="eyebrow">Need more help?</p>
          <h2>Talk to an <em>expert.</em></h2>
          <p>Every financial situation is different. If your question is not covered here, our advisors are ready to help.</p>
          <Link href="/contact" className="text-arrow">Ask our team <ArrowUpRight size={17} /></Link>
          <div className="page-image faq-image">
            <Image src="/photos/finance-analytics.jpg" alt="Financial reports and analytics on a desk" fill sizes="(max-width: 800px) 100vw, 30vw" />
          </div>
        </div>
        <FaqAccordion
          items={faqs}
          description="Can't find what you're looking for? Get in touch with our team and we will gladly help out."
        />
      </section>

      <section className="cta section reveal reveal-up">
        <div>
          <p className="eyebrow">Ready when you are</p>
          <h2>Take the next step toward <em>financial clarity.</em></h2>
        </div>
        <Link href="/contact" className="button button-green">Let&apos;s get in touch <ArrowUpRight size={17} /></Link>
      </section>

      <SiteFooter />
    </main>
  )
}
