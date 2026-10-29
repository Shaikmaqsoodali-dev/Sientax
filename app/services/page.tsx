import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Services',
  description: 'U.S. individual tax filing, audit representation, amendment filing, corporate tax, and payroll services for individuals and businesses.',
}

const services: [string, string, string, string][] = [
  ['01', 'U.S. Individual Tax Filing', 'Comprehensive tax filing services to ensure compliance and maximize deductions for individuals in the USA.', 'us-individual-tax-filing'],
  ['02', 'Tax Audit Representation', 'Expert representation to navigate tax audits and protect your financial interests with confidence.', 'tax-audit-representation'],
  ['03', 'Amendment Filing', 'Correct previous tax returns and optimize your financial situation with accurate amendment filings.', 'amendment-filing'],
  ['04', 'Corporate Tax', 'Tailored corporate tax solutions designed to optimize your company’s tax liabilities and ensure compliance.', 'corporate-tax'],
  ['05', 'Payroll Service', 'Efficient and accurate payroll management to keep your business compliant and employees satisfied.', 'payroll-service'],
]

export default function ServicesPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="inner-hero">
        <p className="eyebrow">What we do</p>
        <h1>Our services and <em>solutions.</em></h1>
        <p>At Sientax, we offer a range of tax-related services designed to meet the needs of individuals and businesses alike. Whether you need help filing personal taxes or managing your business&apos;s tax liabilities, we&apos;ve got you covered.</p>
      </section>
      <section className="media-band">
        <div className="page-image reveal reveal-scale">
          <Image src="/photos/tax-documents.jpg" alt="Tax documents and a calculator prepared for filing" fill sizes="(max-width: 1240px) 100vw, 1180px" />
        </div>
      </section>
      <section className="services service-page-list stagger">
        {services.map(([n, t, d, s]) => (
          <Link href={`/services/${s}`} className="service-row reveal reveal-up" key={n}>
            <span className="service-number">{n}</span>
            <div><h3>{t}</h3><p>{d}</p></div>
            <span className="service-link">Explore service <ArrowUpRight size={17} /></span>
          </Link>
        ))}
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
