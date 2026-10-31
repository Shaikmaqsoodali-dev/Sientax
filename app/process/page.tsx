import type { Metadata } from 'next'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { CtaBanner } from '@/components/cta-banner'

export const metadata: Metadata = {
  title: 'How We Work',
  description: 'A clear, four-step process from initial consultation to ongoing tax optimization — how Sientax works with you.',
}

const steps = [
  { number: '01', title: 'Initial Consultation & Financial Analysis', text: 'We begin by thoroughly assessing your financial landscape to understand your unique tax needs.' },
  { number: '02', title: 'Custom Tax Strategy & Planning', text: 'We craft a personalized tax plan designed to minimize liabilities and achieve your financial objectives.' },
  { number: '03', title: 'Accurate Filing & Compliance', text: 'Our experts ensure timely and accurate tax filings for maximum benefits and compliance.' },
  { number: '04', title: 'Ongoing Consultation & Optimization', text: 'We provide continuous support, with regular reviews to keep your tax strategy optimized year-round.' },
]

const promises = [
  { title: 'A dedicated point of contact', text: 'You work with the same advisor throughout — no repeating your story to new faces.' },
  { title: 'Plain-language guidance', text: 'We explain every decision and form in terms you can act on, without the jargon.' },
  { title: 'Deadlines handled for you', text: 'We track filing dates and requirements so nothing important slips through.' },
  { title: 'Year-round availability', text: 'Tax questions do not wait for tax season. Neither do we — reach out any time.' },
]

export default function ProcessPage() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <PageHero
        eyebrow="How we work"
        title={
          <>
            A simple path to <em>tax clarity.</em>
          </>
        }
        lead="Taxes are complicated. Our mission is to make them simpler for people who aren’t tax professionals — through a clear, four-step process."
        image={{ src: '/photos/planning-session.jpg', alt: 'Advisors and clients reviewing a tax plan together' }}
      />

      <section className="section dark-band">
        <div className="container">
          <div className="section-head section-head--center">
            <div>
              <p className="eyebrow eyebrow--lime">The process</p>
              <h2>
                Simplified tax solutions <em>in 4 steps.</em>
              </h2>
            </div>
          </div>
          <div className="steps-grid steps-grid--4">
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
          <Image src="/photos/tax-planning-workspace.png" alt="A modern tax planning workspace with documents and a laptop" fill sizes="(max-width: 1240px) 100vw, 60vw" />
          <div className="band-note">
            <span>Every plan starts</span>
            <strong>with listening.</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container principles-grid">
          <div className="section-head reveal reveal-left">
            <p className="eyebrow">What working with us feels like</p>
            <h2>
              Support that stays <em>consistent.</em>
            </h2>
          </div>
          <div className="checklist reveal reveal-right">
            {promises.map(p => (
              <div className="check-item" key={p.title}>
                <span className="check-icon"><CheckIcon /></span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Start with a conversation"
        title={<>Ready to take the next step toward <em>financial clarity.</em></>}
        label="Free consultation"
        href="/contact"
      />

      <SiteFooter />
    </main>
  )
}

function CheckIcon() {
  return <Check size={18} />;
}
