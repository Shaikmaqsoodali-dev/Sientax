import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FaqAccordion, type FaqItem } from '@/components/faq-accordion'

export const metadata: Metadata = {
  title: { absolute: 'Sientax | Simplifying Taxation' },
  description: 'Trusted tax and accounting solutions for individuals and businesses across the USA.',
}

const services: [string, string, string, string][] = [
  ['01', 'US Individual Tax Filing', 'Comprehensive tax filing services to ensure compliance and maximize deductions for individuals in the USA.', '/services/us-individual-tax-filing'],
  ['02', 'Tax Audit Representation', 'Expert representation to navigate tax audits and protect your financial interests with confidence.', '/services/tax-audit-representation'],
  ['03', 'Amendment Filing', 'Correct previous tax returns and optimize your financial situation with accurate amendment filings.', '/services/amendment-filing'],
  ['04', 'Corporate Tax', "Tailored corporate tax solutions designed to optimize your company's tax liabilities and ensure compliance.", '/services/corporate-tax'],
  ['05', 'Payroll Service', 'Efficient and accurate payroll management to keep your business compliant and employees satisfied.', '/services/payroll-service'],
]

const steps: [string, string, string][] = [
  ['01', 'Initial Consultation & Financial Analysis', 'We begin by thoroughly assessing your financial landscape to understand your unique tax needs.'],
  ['02', 'Custom Tax Strategy & Planning', 'We craft a personalized tax plan designed to minimize liabilities and achieve your financial objectives.'],
  ['03', 'Accurate Filing & Compliance', 'Our experts ensure timely and accurate tax filings for maximum benefits and compliance.'],
  ['04', 'Ongoing Consultation & Optimization', 'We provide continuous support, with regular reviews to keep your tax strategy optimized year-round.'],
]

const faqs: FaqItem[] = [
  ['What services does Sientax provide?', 'Sientax offers U.S. tax filing, tax audit assistance, amendments, payroll services, and personalized tax planning for individuals and businesses.'],
  ["Who can benefit from Sientax's services?", 'Sientax is ideal for individuals, small businesses, freelancers, and anyone needing tax support in the U.S.'],
  ['How do I schedule a consultation?', "You can book a consultation via Sientax's website, where they offer a free initial consultation."],
]

export default function Home() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> Sientax — Simplifying Taxation</p>
          <h1>Your trusted partner in <em>tax solutions.</em></h1>
          <p className="hero-sub">Simplifying taxes for individuals and businesses across the USA.</p>
          <Link href="/contact" className="button button-green">Start the process <ArrowUpRight size={17} /></Link>
          <div className="trust-points"><span><Check size={15} /> Proven results</span><span><Check size={15} /> Expert trust</span><span><Check size={15} /> Ongoing support</span></div>
        </div>
        <div className="hero-media"><Image src="/sientax-hero.png" alt="Tax advisor reviewing documents with a business owner" fill priority sizes="(max-width: 900px) 100vw, 50vw" /><div className="hero-note"><span>01</span><p>Clear guidance.<br /><strong>Confident decisions.</strong></p></div></div>
      </section>

      <section className="intro section-narrow reveal reveal-up"><p className="eyebrow">The Sientax difference</p><h2>Consult, file, and manage your taxes <em>from anywhere.</em></h2><p className="intro-lead">Seamless online tax filing made easy.</p></section>

      <section className="split-section section"><div className="split-image image-wash reveal reveal-scale"><Image src="/photos/advisor-meeting.jpg" alt="Sientax tax advisor reviewing documents with a client" fill sizes="(max-width: 800px) 100vw, 50vw" /><div className="document-card"><span>Tax clarity</span><strong>Made personal.</strong><div className="document-lines"><i /><i /><i /></div></div></div><div className="split-copy reveal reveal-right"><p className="eyebrow">Why choose us</p><h2>Building trust through results and <em>integrity.</em></h2><p>At Sientax, we are a passionate team of accounting professionals dedicated to providing comprehensive and reliable tax consulting and accounting services. With a diverse group of experts located around the globe, we bring together a wealth of knowledge and experience to help our clients navigate the complexities of tax regulations and financial management.</p><p>Our tax advisors provide consultations and handle legal matters through phone, email, and our secure client portal, ensuring convenient and confidential service.</p><Link href="/about" className="text-arrow">About Sientax <ArrowUpRight size={17} /></Link></div></section>

      <section className="services section"><div className="section-heading reveal reveal-up"><div><p className="eyebrow">Personalized tax help</p><h2>Tax services <em>tailored for you.</em></h2></div><p>Whether you&apos;re optimizing your tax liabilities or ensuring compliance, our expert advisors are your trusted partners in financial success.</p></div><div className="service-list stagger">{services.map(([number, title, description, href]) => <Link href={href} className="service-row reveal reveal-up" key={number}><span className="service-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div><span className="service-link">Learn more <ArrowUpRight size={17} /></span></Link>)}</div><Link href="/services" className="text-arrow reveal reveal-up">View all services <ArrowUpRight size={17} /></Link></section>

      <section className="process section"><div className="section-heading reveal reveal-up"><div><p className="eyebrow">How we work</p><h2>Simplified tax solutions <em>in 4 steps.</em></h2></div><p>Taxes are complicated. But here, we&apos;re on a mission to make them simpler for people who aren&apos;t tax professionals.</p></div><div className="steps stagger">{steps.map(([number, title, description]) => <div className="step reveal reveal-up" key={number}><div className="step-top"><span>{number}</span><div className="step-dot" /></div><h3>{title}</h3><p>{description}</p></div>)}</div><Link href="/process" className="text-arrow light reveal reveal-up">See how we work <ArrowUpRight size={17} /></Link></section>

      <section className="expertise section"><div className="reveal reveal-left"><p className="eyebrow">Proven results</p><h2>Expertise you can <em>trust.</em></h2></div><div className="reveal reveal-right"><p>Sientax prides itself on having a team of experienced professionals who prepare and review tax returns with meticulous attention to detail. Our expertise spans across various tax regulations, ensuring compliance while maximizing your tax benefits. Whether you&apos;re an individual looking to file taxes or a business seeking comprehensive tax planning strategies, we are here to assist you every step of the way.</p><Link href="/contact" className="button button-dark">Free consultation <ArrowUpRight size={16} /></Link></div></section>

      <section className="faq section"><div className="faq-intro reveal reveal-left"><p className="eyebrow">Your questions answered</p><h2>Get informed <em>now.</em></h2><p>Answers to your common questions</p><Link href="/faq" className="text-arrow">All questions <ArrowUpRight size={17} /></Link></div><FaqAccordion items={faqs} description="Can&apos;t find what you&apos;re looking for? Get in touch with our team and we will gladly help out." /></section>

      <section className="cta section reveal reveal-up"><div><p className="eyebrow">Ready when you are</p><h2>Take the next step toward <em>financial clarity.</em></h2></div><div className="cta-actions"><Link href="/contact" className="button button-green">Let&apos;s get in touch <ArrowUpRight size={17} /></Link><Link href="/contact" className="text-arrow light">Free consultation <ArrowUpRight size={17} /></Link></div></section>

      <SiteFooter />
    </main>
  )
}
