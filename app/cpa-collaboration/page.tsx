import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { CtaBanner } from '@/components/cta-banner'

export const metadata: Metadata = {
  title: 'CPA Collaboration Hub',
  description: 'A reliable tax advisory partner for accounting professionals — extend your practice with Sientax.',
}

const values = [
  {
    title: 'Client-first collaboration',
    text: 'Thoughtful support that keeps your team informed and your clients cared for.',
  },
  {
    title: 'Responsive tax expertise',
    text: 'Fast, knowledgeable answers when your clients need dedicated tax support.',
  },
  {
    title: 'Professional, dependable handoff',
    text: 'A clear, respectful transfer of work that protects the client relationship you have built.',
  },
]

export default function CpaPage() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <PageHero
        eyebrow="For accounting partners"
        title={
          <>
            Work better together with <em>Sientax.</em>
          </>
        }
        lead="Our CPA Collaboration Hub helps accounting professionals extend their capacity with a reliable tax advisory partner."
        image={{ src: '/photos/handshake.jpg', alt: 'Two accounting professionals shaking hands in partnership' }}
      />

      <section className="section">
        <div className="container split">
          <div className="split-head reveal reveal-left">
            <p className="eyebrow">CPA Collaboration Hub</p>
            <h2>
              A trusted extension of your <em>practice.</em>
            </h2>
          </div>
          <div className="split-copy reveal reveal-right">
            <p>
              Partner with Sientax when your clients need dedicated tax filing, representation, amendments,
              corporate tax, or payroll support. We collaborate with clarity and respect for the client
              relationship you have built.
            </p>
            <div style={{ marginTop: 26 }}>
              <Link href="/contact" className="btn btn--green">
                Start a conversation <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="section-head section-head--center reveal reveal-up">
            <p className="eyebrow">What partners value</p>
            <h2>
              Clear communication. <em>Consistent support.</em>
            </h2>
          </div>
          <div className="svc-grid">
            {values.map(v => (
              <div className="svc-card" key={v.title}>
                <span className="svc-card-num">{String(values.indexOf(v) + 1).padStart(2, '0')}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
                <span className="link-arrow">
                  Discuss with our team <ArrowRight size={15} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="band reveal reveal-scale">
          <Image src="/photos/wmremove-transformed.jpg" alt="Tax and financial concepts visualised for accounting partners" fill sizes="(max-width: 1240px) 100vw, 60vw" />
          <div className="band-note">
            <span>A partnership</span>
            <strong>built on respect.</strong>
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Partner with us"
        title="Let&apos;s make tax work <em>simpler.</em>"
        label="Contact the team"
        href="/contact"
      />

      <SiteFooter />
    </main>
  )
}
