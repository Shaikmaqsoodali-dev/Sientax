import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const data: Record<string, { title: string; intro: string; image: { src: string; alt: string }; sections: [string, string][] }> = {
  'us-individual-tax-filing': { title: 'U.S. Individual Tax Filing', intro: 'Comprehensive tax filing support to help you meet your obligations with clarity and confidence.', image: { src: '/photos/tax-documents.jpg', alt: 'Tax forms and a calculator prepared for an individual filing' }, sections: [['Tax Planning and Preparation', 'Effective tax planning focuses on reducing tax liability by leveraging favorable tax laws. Our approach involves a comprehensive analysis of your financial situation, considering available allowances, deductions, exemptions, and credits.'], ['Tax Filing Services', 'We are authorized to electronically file tax returns across all U.S. states. E-filing offers faster refunds, greater accuracy, secure submissions, instant confirmation, trackable status, and paperless convenience.'], ['W-4 Form Assistance', 'Filing the correct W-4 form ensures that the right amount of tax is withheld from your paycheck. If your financial situation changes, we recommend reviewing and adjusting your W-4 form.'], ['ITIN Application Support', 'If you or your dependents are not eligible for a Social Security Number, we can assist with obtaining an Individual Taxpayer Identification Number and guide you through Form W-7.']] },
  'tax-audit-representation': { title: 'Tax Audit Representation', intro: 'Facing an IRS audit can be overwhelming. We offer expert representation to help manage the process professionally and efficiently.', image: { src: '/photos/advisor-meeting.jpg', alt: 'A Sientax advisor guiding a client through an audit notice' }, sections: [['Complete Documentation Management', 'We help you gather, organize, and prepare the records needed to support every reported item.'], ['In-Depth Audit Analysis', 'Our experts carefully review the audit notice and help you understand each requirement.'], ['Seamless IRS Communication', 'We handle correspondence and represent you directly before the IRS, keeping you informed throughout the process.']] },
  'amendment-filing': { title: 'Amendment Filing', intro: 'Correct previous tax returns and move forward with accurate, carefully prepared amendment filings.', image: { src: '/photos/finance-analytics.jpg', alt: 'Financial figures being reviewed and corrected on a laptop' }, sections: [['Review and identify', 'We review the original return and identify the information that needs to be corrected.'], ['Prepare the amendment', 'We prepare the amended return with supporting details and clear documentation.'], ['Guide the next step', 'We explain filing requirements and help you understand what happens after submission.']] },
  'corporate-tax': { title: 'Corporate Tax', intro: 'Tailored corporate tax solutions designed to optimize your company’s tax liabilities and ensure compliance.', image: { src: '/photos/office-space.jpg', alt: 'A modern business office where corporate tax planning takes place' }, sections: [['Planning and compliance', 'We help businesses understand changing requirements and plan with greater clarity.'], ['Business tax support', 'From small to medium-sized enterprises, we provide tailored strategies for your business.']] },
  'payroll-service': { title: 'Payroll Service', intro: 'Efficient and accurate payroll management to keep your business compliant and employees supported.', image: { src: '/photos/team-collab.jpg', alt: 'A payroll team coordinating schedules and records together' }, sections: [['Reliable administration', 'Keep payroll processes organized with consistent support and attention to detail.'], ['Compliance support', 'We help you stay aligned with payroll requirements while your business grows.']] },
}

export function generateStaticParams() {
  return Object.keys(data).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = data[slug]
  if (!item) return { title: 'Service not found' }
  return { title: item.title, description: item.intro }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = data[slug]
  if (!item) notFound()

  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="inner-hero service-detail-hero">
        <p className="eyebrow">Sientax services</p>
        <h1>{item.title}</h1>
        <p>{item.intro}</p>
      </section>
      <section className="media-band tight">
        <div className="page-image reveal reveal-scale">
          <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 1240px) 100vw, 1180px" />
        </div>
      </section>
      <section className="service-detail section stagger">
        {item.sections.map(([title, text], i) => (
          <article className="reveal reveal-up" key={title}>
            <span>0{i + 1}</span>
            <div><h2>{title}</h2><p>{text}</p></div>
          </article>
        ))}
      </section>
      <section className="cta section reveal reveal-up">
        <div>
          <p className="eyebrow">Free consultation</p>
          <h2>Let&apos;s make your next step <em>simpler.</em></h2>
        </div>
        <Link href="/contact" className="button button-green">Talk to an expert <ArrowUpRight size={17} /></Link>
      </section>
      <SiteFooter />
    </main>
  )
}
