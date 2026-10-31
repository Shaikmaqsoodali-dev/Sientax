import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check, Play, Star, User, MessagesSquare, ShieldCheck, CalendarCheck, MessageSquare, Compass, FileCheck2, TrendingUp } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CtaBanner } from '@/components/cta-banner'
import { FaqAccordion, type FaqItem } from '@/components/faq-accordion'
import { ServicesAccordion } from '@/components/services-accordion'
import { Stats } from '@/components/stats'

export const metadata: Metadata = {
  title: { absolute: 'Sientax | Simplifying Taxation' },
  description: 'Trusted tax and accounting solutions for individuals and businesses across the USA.',
}

const services = [
  {
    number: '01',
    title: 'US Individual Tax Filing',
    description: 'Comprehensive tax filing services to ensure compliance and maximize deductions for individuals in the USA.',
    href: '/services/us-individual-tax-filing',
  },
  {
    number: '02',
    title: 'Tax Audit Representation',
    description: 'Expert representation to navigate tax audits and protect your financial interests with confidence.',
    href: '/services/tax-audit-representation',
  },
  {
    number: '03',
    title: 'Amendment Filing',
    description: 'Correct previous tax returns and optimize your financial situation with accurate amendment filings.',
    href: '/services/amendment-filing',
  },
  {
    number: '04',
    title: 'Corporate Tax',
    description: "Tailored corporate tax solutions designed to optimize your company's tax liabilities and ensure compliance.",
    href: '/services/corporate-tax',
  },
  {
    number: '05',
    title: 'Payroll Service',
    description: 'Efficient and accurate payroll management to keep your business compliant and employees satisfied.',
    href: '/services/payroll-service',
  },
]

const expectItems = [
  ['01', 'Personal guidance', 'A dedicated advisor takes the time to understand your financial situation before recommending anything.'],
  ['02', 'Accurate & organized', 'We prepare and review your returns with meticulous attention, keeping every document in order.'],
  ['03', 'Year-round support', 'Tax questions do not wait for tax season — neither do we. Reach out any time.'],
]

const supportChecks = [
  { icon: User, title: 'Experienced professionals', text: 'Seasoned tax professionals prepare and review every return with meticulous attention to detail.' },
  { icon: MessagesSquare, title: 'Clear communication', text: 'We explain every decision and form in plain language, without the jargon.' },
  { icon: ShieldCheck, title: 'Secure & organized', text: 'A secure client portal keeps document submissions and communications in one trusted place.' },
  { icon: CalendarCheck, title: 'Year-round support', text: 'Ongoing consultation and optimization to keep your tax strategy sharp all year long.' },
]

const features = [
  { number: '01', icon: MessageSquare, dark: true, title: 'Start with a conversation', text: 'An initial consultation and financial analysis to understand your unique tax needs.' },
  { number: '02', icon: Compass, dark: false, title: 'We plan your strategy', text: 'A personalized tax plan designed to minimize liabilities and achieve your financial goals.' },
  { number: '03', icon: FileCheck2, dark: false, title: 'We handle the filing', text: 'Accurate, timely filings reviewed by a professional — no DIY guesswork.' },
  { number: '04', icon: TrendingUp, dark: true, title: 'Clarity, year-round', text: 'Ongoing consultation and optimization to keep your tax strategy optimized.' },
]

const testimonials = [
  {
    quote: 'Sientax made taxes feel manageable. They explained everything clearly, and for the first time I felt confident about my numbers.',
    name: 'Sarah Mitchell',
    role: 'Small business owner',
    initials: 'SM',
    tone: '1',
  },
  {
    quote: 'The audit experience was honestly the smoothest part of the whole process. We had a representative on our side from day one.',
    name: 'Michael Carter',
    role: 'Agency owner',
    initials: 'MC',
    tone: '2',
  },
  {
    quote: 'Finally, a team that speaks human. Every question was answered in plain language, and nothing felt overwhelming or confusing.',
    name: 'Emily Rodriguez',
    role: 'Independent consultant',
    initials: 'ER',
    tone: '3',
  },
  {
    quote: 'They found deductions our previous advisor completely missed. It was worth every penny — and then some.',
    name: 'Alex Mercer',
    role: 'SaaS founder',
    initials: 'AM',
    tone: '4',
  },
  {
    quote: 'Payroll used to be the biggest headache for our studio. Sientax took it over and made it boring in the best possible way.',
    name: 'Jordan Lee',
    role: 'Studio owner',
    initials: 'JL',
    tone: '1',
  },
  {
    quote: 'I filed alone before and got a surprise letter. Sientax fixed it quietly, explained everything, and protected my refund.',
    name: 'Taylor Brooks',
    role: 'Individual client',
    initials: 'TB',
    tone: '2',
  },
]

const plans = [
  {
    label: 'Individual tax',
    pill: 'Free consultation',
    title: 'For individuals & families',
    href: '/services/us-individual-tax-filing',
    src: '/photos/laptop-desk-still-life.jpg',
    alt: 'High-angle view of a laptop and desk setup prepared for individual tax filing',
    features: ['Tax planning & preparation', 'E-filing across all 50 states', 'Year-round support'],
    cta: 'Explore individual tax',
  },
  {
    label: 'Business tax',
    pill: 'Free consultation',
    title: 'For your business & team',
    href: '/services/corporate-tax',
    src: '/photos/laptop-wooden-cubes.jpg',
    alt: 'A laptop arranged with wooden cubes, representing structured business tax planning',
    features: ['Corporate tax compliance & planning', 'Payroll and year-end forms', 'Audit representation when needed'],
    cta: 'Explore business tax',
  },
]

const homeFaqs: FaqItem[] = [
  ['What services does Sientax provide?', 'Sientax offers U.S. tax filing, tax audit assistance, amendments, payroll services, and personalized tax planning for individuals and businesses.'],
  ["Who can benefit from Sientax's services?", 'Sientax is ideal for individuals, small businesses, freelancers, and anyone needing tax support in the U.S.'],
  ['How do I schedule a consultation?', "You can book a consultation via Sientax's website, where they offer a free initial consultation."],
  ['Is there a secure way to submit documents?', 'Yes, Sientax provides a secure client portal for document submissions and communications.'],
  ['Can you represent me in a tax audit?', 'Yes. Our experts handle communication with the IRS on your behalf, manage documentation, and guide you through every stage of the audit process.'],
  ['Do you work with CPA and accounting firms?', 'Yes. Our CPA Collaboration Hub lets accounting professionals extend their capacity with a reliable tax advisory partner.'],
]

const insights = [
  {
    tag: 'Getting started',
    title: 'What to bring to your first tax consultation',
    href: '/process',
    more: 'See how we work',
    src: 'https://res.cloudinary.com/qxjpbgh6/image/upload/v1793362797/calculator-magnifying-glass-table.jpg',
    alt: 'Calculator and magnifying glass over a table of tax documents',
  },
  {
    tag: 'Tax filing',
    title: 'Common filing mistakes worth avoiding',
    href: '/services/us-individual-tax-filing',
    more: 'Explore individual tax',
    src: '/photos/finance-analytics.jpg',
    alt: 'Financial figures being reviewed on a laptop',
  },
  {
    tag: 'Payroll',
    title: 'Keeping payroll records clean all year',
    href: '/services/payroll-service',
    more: 'Explore payroll',
    src: 'https://res.cloudinary.com/qxjpbgh6/image/upload/v1793362780/high-angle-payroll-concept.jpg',
    alt: 'High-angle payroll team coordination concept',
  },
]

const tickerItems = ['Tax preparation', 'Audit representation', 'Amendment filing', 'Corporate tax', 'Payroll support', 'Tax planning', 'IRS e-file']

function Stars() {
  return (
    <span className="stars" aria-label="Rated 5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  )
}

export default function Home() {
  return (
    <main className="site-shell">
      <SiteHeader />

      {/* ═══════════ HERO ═══════════ */}
      <section className="hero" id="top">
        <Image
          src="/sientax-hero.png"
          alt="Tax advisor reviewing tax documents with a client"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 50vw"
          className="hero-img"
        />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow eyebrow--lime">Simplifying taxation</p>
            <h1>
              Your trusted partner in <em>tax solutions.</em>
            </h1>
            <p className="hero-lead">Simplifying taxes for individuals and businesses across the USA.</p>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn--lime">
                Start the process <ArrowRight size={17} />
              </Link>
              <Link href="/services" className="btn btn--ghost">
                Explore services <ArrowRight size={17} />
              </Link>
            </div>
            <div className="trust-points">
              <span><Check size={14} /> Proven results</span>
              <span><Check size={14} /> Expert trust</span>
              <span><Check size={14} /> Ongoing support</span>
            </div>
          </div>
          <aside className="hero-aside">
            <div className="hero-badge">
              <Stars />
              <strong>4.9 / 5</strong>
              <span>Average client rating</span>
            </div>
            <div className="hero-badge">
              <strong>30+</strong>
              <span>Years of tax expertise</span>
            </div>
          </aside>
        </div>
        <div className="hero-strip">
          <Link href="/services/us-individual-tax-filing" className="hero-strip-card">
            <div>
              <small>Personal Tax</small>
              <strong>Individuals &amp; families</strong>
            </div>
            <ArrowUpRight size={18} />
          </Link>
          <Link href="/services/corporate-tax" className="hero-strip-card">
            <div>
              <small>Business Tax</small>
              <strong>Companies &amp; teams</strong>
            </div>
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      {/* ═══════════ TICKER ═══════════ */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map(d => (
            <div key={d} style={{ display: 'contents' }}>
              {tickerItems.map(item => (
                <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: 46 }}>
                  {item} <i />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ INTRO ═══════════ */}
      <section className="section section--tight">
        <div className="container intro-inner">
          <p className="eyebrow">The Sientax difference</p>
          <h2>
            Consult, file, and manage your taxes <em>from anywhere.</em>
          </h2>
          <p className="intro-lead">Seamless online tax filing made easy.</p>
        </div>
      </section>

      {/* ═══════════ WHAT TO EXPECT ═══════════ */}
      <section className="section">
        <div className="container">
          <div className="expect-grid">
            <div className="expect-panel reveal reveal-left">
              <p className="eyebrow eyebrow--lime">What to expect</p>
              <h2>
                A clear path, from first <em>call to filing.</em>
              </h2>
              <div className="expect-list">
                {expectItems.map(([number, title, text]) => (
                  <div className="expect-item" key={number}>
                    <span>{number}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/process" className="btn btn--lime btn--sm">
                How we work <ArrowRight size={15} />
              </Link>
            </div>
            <div className="expect-media reveal reveal-right">
              <Image src="/photos/man-with-laptop.jpg" alt="A client working on a laptop during a remote tax consultation" fill sizes="(max-width: 900px) 100vw, 45vw" />
              <Link href="/process" className="play-btn" aria-label="See how we work">
                <Play size={26} fill="currentColor" />
              </Link>
              <div className="band-note">
                <span>Every plan starts</span>
                <strong>with listening.</strong>
              </div>
            </div>
          </div>
          <Stats
            items={[
              { value: 30, suffix: '+', label: 'Years of experience' },
              { value: 50, label: 'States we e-file in' },
              { value: 5, label: 'Core service areas' },
              { value: 100, suffix: '%', label: 'Confidential & secure' },
            ]}
          />
        </div>
      </section>

      {/* ═══════════ DARK SERVICES ═══════════ */}
      <section className="section dark-band">
        <div className="container dark-grid">
          <div className="dark-copy reveal reveal-left">
            <p className="eyebrow eyebrow--lime">Our services</p>
            <h2>
              Everything you need. <em>One trusted partner.</em>
            </h2>
            <p>
              From personal returns to corporate tax and payroll, every service is handled by the same
              team — so your strategy stays connected from first consultation to filing season.
            </p>
            <Link href="/services" className="btn btn--lime">
              View all services <ArrowRight size={16} />
            </Link>
          </div>
          <ServicesAccordion items={services} />
        </div>
      </section>

      {/* ═══════════ SUPPORT ═══════════ */}
      <section className="section">
        <div className="container support-grid">
          <div className="support-head reveal reveal-left">
            <p className="eyebrow">Why choose us</p>
            <h2>
              Financial clarity starts with <em>the right support.</em>
            </h2>
            <div className="support-media">
              <Image src="https://res.cloudinary.com/qxjpbgh6/image/upload/v1793362793/female-professional-explaining-document-details-client-workplace-serious-business-leader-consulting-financial-legal-expert-teamwork-cooperation-concept.jpg" alt="A tax professional explaining financial documents with a client" fill sizes="(max-width: 900px) 100vw, 45vw" />
            </div>
          </div>
          <div className="support-copy reveal reveal-right">
            <p>
              At Sientax, we are a passionate team of accounting professionals dedicated to providing
              comprehensive and reliable tax consulting and accounting services. With a diverse group of
              experts located around the globe, we bring together a wealth of knowledge and experience to
              help our clients navigate the complexities of tax regulations and financial management.
            </p>
            <p>
              Our tax advisors provide consultations and handle legal matters through phone, email, and
              our secure client portal, ensuring convenient and confidential service.
            </p>
            <div className="checklist">
              {supportChecks.map(c => (
                <div className="check-item" key={c.title}>
                  <span className="check-icon">
                    <c.icon size={18} />
                  </span>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES / PROCESS ═══════════ */}
      <section className="section section--paper">
        <div className="container simple-grid">
          <div className="simple-copy reveal reveal-left">
            <p className="eyebrow">How it works</p>
            <h2>
              A simpler way to handle your <em>finances.</em>
            </h2>
            <p>
              Four steps, one dedicated advisor who understands your situation. No jargon, no
              overwhelm, no surprises.
            </p>
            <Link href="/process" className="link-arrow">
              Our process <ArrowRight size={15} />
            </Link>
          </div>
          <div className="simple-cards stagger">
            {features.map(f => (
              <div className={`feature-card${f.dark ? ' feature-card--dark' : ''}`} key={f.number}>
                <div className="feature-card-top">
                  <span className="feature-card-icon">
                    <f.icon size={20} />
                  </span>
                  <span className="feature-card-num">0{f.number}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PHOTO BAND ═══════════ */}
      <section className="section">
        <div className="band reveal reveal-scale">
          <Image src="https://res.cloudinary.com/qxjpbgh6/image/upload/v1793362801/tax-credits-claim-return-deduction-refund-concept.jpg" alt="Tax credits, deductions, and refund claims being accounted for" fill sizes="(max-width: 1240px) 100vw, 70vw" />
          <div className="band-note">
            <span>Tax season</span>
            <strong>Smart claims.</strong>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--center reveal reveal-up">
            <p className="eyebrow">Testimonials</p>
            <h2>Good advice. Better experiences.</h2>
            <p>Hear how clients describe the clarity and confidence they gained with Sientax.</p>
          </div>
          <div className="testi-grid">
            <aside className="testi-feature reveal reveal-left">
              <div className="testi-score">4.9</div>
              <Stars />
              <blockquote>“{testimonials[0].quote}”</blockquote>
              <div className="testi-media">
                <Image src="/photos/team-collab.jpg" alt="The Sientax team collaborating around a table" fill sizes="(max-width: 900px) 100vw, 40vw" />
                <Link href="/contact" className="testi-media-cta">
                  Book your free consultation <ArrowRight size={15} />
                </Link>
              </div>
            </aside>
            <div className="testi-cards">
              {testimonials.slice(1).map(t => (
                <div className="testi-card reveal reveal-up" key={t.name}>
                  <Stars />
                  <blockquote>“{t.quote}”</blockquote>
                  <div className="testi-person">
                    <span className={`avatar avatar--${t.tone}`}>{t.initials}</span>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PLANS ═══════════ */}
      <section className="section plans-block">
        <div className="container">
          <div className="section-head section-head--center reveal reveal-up">
            <p className="eyebrow">Plans</p>
            <h2>
              Personal or business. <em>We&apos;ve got you.</em>
            </h2>
            <p>Whether you&apos;re filing for yourself or running a team, the right support is one conversation away.</p>
          </div>
          <div className="plans-grid">
            {plans.map(plan => (
              <div className="plan-card reveal reveal-up" key={plan.label}>
                <div className="plan-top">
                  <span className="plan-label">{plan.label}</span>
                  <span className="plan-pill">{plan.pill}</span>
                </div>
                <h3>{plan.title}</h3>
                <div className="plan-media">
                  <Image src={plan.src} alt={plan.alt} fill sizes="(max-width: 900px) 100vw, 45vw" />
                </div>
                <ul className="plan-features">
                  {plan.features.map(f => (
                    <li key={f}>
                      <Check size={16} /> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="btn btn--green">
                  {plan.cta} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="section section--paper">
        <div className="faq-block">
          <div className="container">
            <div className="faq-intro-block">
              <p className="eyebrow">FAQ</p>
              <h2>Questions? <em>We&apos;ve got clear answers.</em></h2>
              <p>Answers to the questions we hear most often about Sientax services, consultations, documents, and experience.</p>
            </div>
            <FaqAccordion items={homeFaqs} columns={1} defaultOpen={0} />
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <CtaBanner
        eyebrow="Ready when you are"
        title="Take the next step toward <em>financial clarity.</em>"
        label="Let&apos;s get in touch"
        href="/contact"
      />

      {/* ═══════════ INSIGHTS ═══════════ */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--row reveal reveal-up">
            <div>
              <p className="eyebrow">Advice worth reading</p>
              <h2>Insights for calmer tax <em>seasons.</em></h2>
            </div>
            <Link href="/faq" className="link-arrow">
              View all resources <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="insight-grid stagger">
            {insights.map(item => (
              <Link href={item.href} className="insight-card" key={item.title}>
                <div className="insight-media">
                  <Image src={item.src} alt={item.alt} fill sizes="(max-width: 900px) 100vw, 45vw" />
                </div>
                <div className="insight-body">
                  <span className="tag">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <div className="insight-more">
                    {item.more} <ArrowUpRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
