import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'CPA Collaboration Hub',
  description: 'A reliable tax advisory partner for accounting professionals — extend your practice with Sientax.',
}

const values: [string, string][] = [
  ['Client-first collaboration', 'Thoughtful support that keeps your team informed and your clients cared for.'],
  ['Responsive tax expertise', 'Fast, knowledgeable answers when your clients need dedicated tax support.'],
  ['Professional, dependable handoff', 'A clear, respectful transfer of work that protects the client relationship you have built.'],
]

export default function CpaPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="inner-hero">
        <p className="eyebrow">For accounting partners</p>
        <h1>Work better together with <em>Sientax.</em></h1>
        <p>Our CPA Collaboration Hub helps accounting professionals extend their capacity with a reliable tax advisory partner.</p>
      </section>
      <section className="media-band">
        <div className="page-image reveal reveal-scale">
          <Image src="/photos/handshake.jpg" alt="Two accounting professionals shaking hands in partnership" fill sizes="(max-width: 1240px) 100vw, 1180px" />
          <div className="hero-note"><span>03</span><p>A partnership built on<br /><strong>mutual respect.</strong></p></div>
        </div>
      </section>
      <section className="editorial-page section">
        <div className="reveal reveal-left">
          <p className="eyebrow">CPA Collaboration Hub</p>
          <h2>A trusted extension of your <em>practice.</em></h2>
        </div>
        <div className="reveal reveal-right">
          <p>Partner with Sientax when your clients need dedicated tax filing, representation, amendments, corporate tax, or payroll support. We collaborate with clarity and respect for the client relationship you have built.</p>
          <Link href="/contact" className="text-arrow">Start a conversation <ArrowUpRight size={17} /></Link>
        </div>
      </section>
      <section className="principles section">
        <div className="reveal reveal-left">
          <p className="eyebrow">What partners value</p>
          <h2>Clear communication. <em>Consistent support.</em></h2>
        </div>
        <div className="principle-list stagger">{values.map(([title, text], i) => <div className="principle reveal reveal-up" key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div><Check size={18} /></div>)}</div>
      </section>
      <section className="cta section reveal reveal-up">
        <div>
          <p className="eyebrow">Partner with us</p>
          <h2>Let&apos;s make tax work <em>simpler.</em></h2>
        </div>
        <Link href="/contact" className="button button-green">Contact the team <ArrowUpRight size={17} /></Link>
      </section>
      <SiteFooter />
    </main>
  )
}
