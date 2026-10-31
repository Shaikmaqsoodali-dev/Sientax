import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, User, ShieldAlert, RotateCcw, Building2, CreditCard } from 'lucide-react'

const serviceIcons: Record<string, React.ElementType> = {
  user: User,
  'shield-alert': ShieldAlert,
  'rotate-ccw': RotateCcw,
  building: Building2,
  'credit-card': CreditCard,
}
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { CtaBanner } from '@/components/cta-banner'

export const metadata: Metadata = {
  title: 'Services',
  description: 'U.S. individual tax filing, audit representation, amendment filing, corporate tax, and payroll services for individuals and businesses.',
}

const services = [
  {
    number: '01',
    title: 'US Individual Tax Filing',
    description: 'Comprehensive tax filing services to ensure compliance and maximize deductions for individuals in the USA.',
    href: '/services/us-individual-tax-filing',
    icon: 'user',
  },
  {
    number: '02',
    title: 'Tax Audit Representation',
    description: 'Expert representation to navigate tax audits and protect your financial interests with confidence.',
    href: '/services/tax-audit-representation',
    icon: 'shield-alert',
  },
  {
    number: '03',
    title: 'Amendment Filing',
    description: 'Correct previous tax returns and optimize your financial situation with accurate amendment filings.',
    href: '/services/amendment-filing',
    icon: 'rotate-ccw',
  },
  {
    number: '04',
    title: 'Corporate Tax',
    description: "Tailored corporate tax solutions designed to optimize your company's tax liabilities and ensure compliance.",
    href: '/services/corporate-tax',
    icon: 'building',
  },
  {
    number: '05',
    title: 'Payroll Service',
    description: 'Efficient and accurate payroll management to keep your business compliant and employees satisfied.',
    href: '/services/payroll-service',
    icon: 'credit-card',
  },
]

export default function ServicesPage() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <PageHero
        eyebrow="What we do"
        title={
          <>
            Our services and <em>solutions.</em>
          </>
        }
        lead="At Sientax, we offer a range of tax-related services designed to meet the needs of individuals and businesses alike. Whether you need help filing personal taxes or managing your business's tax liabilities, we have you covered."
        image={{ src: '/photos/tax-planning-workspace.png', alt: 'A modern tax planning workspace with a laptop and documents' }}
      />

      <section className="section">
        <div className="container">
          <div className="section-head reveal reveal-up">
            <div>
              <p className="eyebrow">Everything we handle</p>
              <h2>
                Tax support for every <em>stage.</em>
              </h2>
            </div>
            <p>Every engagement is staffed by senior advisors — never junior support alone.</p>
          </div>
          <div className="svc-grid">
            {services.map((s, i) => {
              const Icon = s.icon ? serviceIcons[s.icon] : null
              return (
                <Link href={s.href} className="svc-card" key={s.number}>
                  <div className="svc-card-top">
                    <span className="svc-card-num">
                      {Icon && <span className="svc-card-icon"><Icon size={16} /></span>}
                      {s.number}
                    </span>
                    <span className="svc-card-arrow">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <span className="link-arrow">
                    Explore service <ArrowRight size={15} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="band reveal reveal-scale">
          <Image src="https://res.cloudinary.com/qxjpbgh6/image/upload/v1793362790/accountant-making-calculations-office.jpg" alt="An accountant making tax calculations in the office" fill sizes="(max-width: 1240px) 100vw, 70vw" />
          <div className="band-note">
            <span>Tax data</span>
            <strong>In good hands.</strong>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="split">
            <div className="split-head reveal reveal-left">
              <p className="eyebrow">Who we help</p>
              <h2>
                Individuals. Businesses. <em>Founders.</em>
              </h2>
            </div>
            <div className="split-copy reveal reveal-right">
              <p>
                From sole proprietors and freelancers to growing companies and established practices,
                our advisors meet clients where they are — and then guide them forward with clear,
                practical tax strategy.
              </p>
              <p>
                Our CPA Collaboration Hub also lets trusted accounting professionals refer clients to us
                as their dedicated tax advisory partner.
              </p>
              <Link href="/cpa-collaboration" className="btn btn--green">
                Learn about the CPA Hub <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Start with a conversation"
        title="Not sure which service fits? <em>Let&apos;s talk it through.</em>"
        label="Book your free consultation"
        href="/contact"
      />

      <SiteFooter />
    </main>
  )
}
