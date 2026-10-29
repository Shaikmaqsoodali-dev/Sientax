import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet the team of accounting professionals behind Sientax and the standards we hold ourselves to.',
}

const principles: [string, string][] = [
  ['Personalized Services', 'We tailor our services to fit your unique financial needs, providing a customized approach to tax consulting.'],
  ['Global Expertise', 'Our team comprises professionals with extensive experience in various jurisdictions, allowing us to cater to a diverse clientele.'],
  ['Commitment to Excellence', 'We are dedicated to maintaining the highest standards of professionalism and integrity in all our dealings.'],
]

export default function AboutPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="inner-hero">
        <p className="eyebrow">About Sientax</p>
        <h1>Making a positive <em>impact.</em></h1>
        <p>We believe in building lasting relationships with our clients by offering personalized strategies that fit your unique financial needs, ensuring maximum benefits and peace of mind.</p>
      </section>
      <section className="media-band">
        <div className="page-image reveal reveal-scale">
          <Image src="/photos/team-collab.jpg" alt="The Sientax team collaborating around a table" fill sizes="(max-width: 1240px) 100vw, 1180px" />
          <div className="hero-note"><span>02</span><p>One team.<br /><strong>Shared standards.</strong></p></div>
        </div>
      </section>
      <section className="editorial-page section">
        <div className="reveal reveal-left">
          <p className="eyebrow">Our standards</p>
          <h2>We hold ourselves to <em>high standards.</em></h2>
        </div>
        <div className="reveal reveal-right">
          <p>At Sientax, we are a passionate team of accounting professionals dedicated to providing comprehensive and reliable tax consulting and accounting services. With a diverse group of experts located around the globe, we bring together a wealth of knowledge and experience to help our clients navigate the complexities of tax regulations and financial management.</p>
        </div>
      </section>
      <section className="principles section">
        <div className="reveal reveal-left">
          <p className="eyebrow">Why choose us</p>
          <h2>Building trust through results and <em>integrity.</em></h2>
        </div>
        <div className="principle-list stagger">{principles.map(([title, text], i) => <div className="principle reveal reveal-up" key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div><Check size={18} /></div>)}</div>
      </section>
      <section className="cta section reveal reveal-up">
        <div>
          <p className="eyebrow">Let&apos;s work together</p>
          <h2>Ready to take the stress out of <em>tax season?</em></h2>
        </div>
        <Link href="/contact" className="button button-green">Contact us <ArrowUpRight size={17} /></Link>
      </section>
      <SiteFooter />
    </main>
  )
}
