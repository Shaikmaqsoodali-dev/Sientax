import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'How We Work',
  description: 'A clear, four-step process from initial consultation to ongoing tax optimization — how Sientax works with you.',
}

const steps: [string, string, string][] = [
  ['01', 'Initial Consultation & Financial Analysis', 'We begin by thoroughly assessing your financial landscape to understand your unique tax needs.'],
  ['02', 'Custom Tax Strategy & Planning', 'We craft a personalized tax plan designed to minimize liabilities and achieve your financial objectives.'],
  ['03', 'Accurate Filing & Compliance', 'Our experts ensure timely and accurate tax filings for maximum benefits and compliance.'],
  ['04', 'Ongoing Consultation & Optimization', 'We provide continuous support, with regular reviews to keep your tax strategy optimized year-round.'],
]

const promises: [string, string][] = [
  ['A dedicated point of contact', 'You work with the same advisor throughout — no repeating your story to new faces.'],
  ['Plain-language guidance', 'We explain every decision and form in terms you can act on, without the jargon.'],
  ['Deadlines handled for you', 'We track filing dates and requirements so nothing important slips through.'],
  ['Year-round availability', 'Tax questions do not wait for tax season. Neither do we — reach out any time.'],
]

export default function ProcessPage() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <section className="inner-hero">
        <p className="eyebrow">How we work</p>
        <h1>A simple path to <em>tax clarity.</em></h1>
        <p>Taxes are complicated. Our mission is to make them simpler for people who aren&apos;t tax professionals — through a clear, four-step process.</p>
      </section>

      <section className="process section">
        <div className="section-heading reveal reveal-up">
          <div>
            <p className="eyebrow">The process</p>
            <h2>Simplified tax solutions <em>in 4 steps.</em></h2>
          </div>
          <p>From the first conversation to year-round optimization, every stage is designed to keep you informed and confident.</p>
        </div>
        <div className="steps stagger">{steps.map(([number, title, description]) => <div className="step reveal reveal-up" key={number}><div className="step-top"><span>{number}</span><div className="step-dot" /></div><h3>{title}</h3><p>{description}</p></div>)}</div>
      </section>

      <section className="media-band spaced">
        <div className="page-image reveal reveal-scale">
          <Image src="/photos/planning-session.jpg" alt="Advisors and clients reviewing a tax plan together" fill sizes="(max-width: 1240px) 100vw, 1180px" />
          <div className="hero-note"><span>01</span><p>Every plan starts<br /><strong>with listening.</strong></p></div>
        </div>
      </section>

      <section className="principles section">
        <div className="reveal reveal-left">
          <p className="eyebrow">What working with us feels like</p>
          <h2>Support that stays <em>consistent.</em></h2>
        </div>
        <div className="principle-list stagger">{promises.map(([title, text], i) => <div className="principle reveal reveal-up" key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
      </section>

      <section className="expertise section">
        <div className="reveal reveal-left">
          <p className="eyebrow">Proven results</p>
          <h2>Expertise you can <em>trust.</em></h2>
        </div>
        <div className="reveal reveal-right">
          <p>Our team of experienced professionals prepares and reviews tax returns with meticulous attention to detail, spanning across various tax regulations. Whether you&apos;re an individual looking to file taxes or a business seeking comprehensive tax planning strategies, we are here to assist you every step of the way.</p>
          <Link href="/contact" className="button button-dark">Free consultation <ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <section className="cta section reveal reveal-up">
        <div>
          <p className="eyebrow">Start with a conversation</p>
          <h2>Take the next step toward <em>financial clarity.</em></h2>
        </div>
        <Link href="/contact" className="button button-green">Free consultation <ArrowUpRight size={17} /></Link>
      </section>

      <SiteFooter />
    </main>
  )
}
