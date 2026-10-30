import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { CtaBanner } from '@/components/cta-banner'

interface ServiceSection {
  title: string
  text: string
}

interface Service {
  slug: string
  title: string
  intro: string
  image: { src: string; alt: string }
  sections: ServiceSection[]
}

const serviceList: Service[] = [
  {
    slug: 'us-individual-tax-filing',
    title: 'U.S. Individual Tax Filing',
    intro: 'Comprehensive tax filing support to help you meet your obligations with clarity and confidence.',
    image: { src: '/photos/tax-documents.jpg', alt: 'Tax forms and a calculator prepared for an individual filing' },
    sections: [
      {
        title: 'Tax Planning and Preparation',
        text: 'Effective tax planning focuses on reducing tax liability by leveraging favorable tax laws. Our approach involves a comprehensive analysis of your financial situation, considering available allowances, deductions, exemptions, and credits.',
      },
      {
        title: 'Tax Filing Services',
        text: 'We are authorized to electronically file tax returns across all U.S. states. E-filing offers faster refunds, greater accuracy, secure submissions, instant confirmation, trackable status, and paperless convenience.',
      },
      {
        title: 'W-4 Form Assistance',
        text: 'Filing the correct W-4 form ensures that the right amount of tax is withheld from your paycheck. If your financial situation changes, we recommend reviewing and adjusting your W-4 form.',
      },
      {
        title: 'ITIN Application Support',
        text: 'If you or your dependents are not eligible for a Social Security Number, we can assist with obtaining an Individual Taxpayer Identification Number and guide you through Form W-7.',
      },
    ],
  },
  {
    slug: 'tax-audit-representation',
    title: 'Tax Audit Representation',
    intro: 'Facing an IRS audit can be overwhelming. We offer expert representation to help manage the process professionally and efficiently.',
    image: { src: '/photos/advisor-meeting.jpg', alt: 'A Sientax advisor guiding a client through an audit notice' },
    sections: [
      {
        title: 'Complete Documentation Management',
        text: 'We help you gather, organize, and prepare the records needed to support every reported item.',
      },
      {
        title: 'In-Depth Audit Analysis',
        text: 'Our experts carefully review the audit notice and help you understand each requirement.',
      },
      {
        title: 'Seamless IRS Communication',
        text: 'We handle correspondence and represent you directly before the IRS, keeping you informed throughout the process.',
      },
    ],
  },
  {
    slug: 'amendment-filing',
    title: 'Amendment Filing',
    intro: 'Correct previous tax returns and move forward with accurate, carefully prepared amendment filings.',
    image: { src: '/photos/finance-analytics.jpg', alt: 'Financial figures being reviewed and corrected on a laptop' },
    sections: [
      { title: 'Review and identify', text: 'We review the original return and identify the information that needs to be corrected.' },
      { title: 'Prepare the amendment', text: 'We prepare the amended return with supporting details and clear documentation.' },
      { title: 'Guide the next step', text: 'We explain filing requirements and help you understand what happens after submission.' },
    ],
  },
  {
    slug: 'corporate-tax',
    title: 'Corporate Tax',
    intro: 'Tailored corporate tax solutions designed to optimize your company’s tax liabilities and ensure compliance.',
    image: { src: '/photos/office-space.jpg', alt: 'A modern business office where corporate tax planning takes place' },
    sections: [
      { title: 'Planning and compliance', text: 'We help businesses understand changing requirements and plan with greater clarity.' },
      { title: 'Business tax support', text: 'From small to medium-sized enterprises, we provide tailored strategies for your business.' },
    ],
  },
  {
    slug: 'payroll-service',
    title: 'Payroll Service',
    intro: 'Efficient and accurate payroll management to keep your business compliant and employees supported.',
    image: { src: 'https://res.cloudinary.com/qxjpbgh6/image/upload/v1793362780/high-angle-payroll-concept.jpg', alt: 'High-angle payroll team coordination concept' },
    sections: [
      { title: 'Reliable administration', text: 'Keep payroll processes organized with consistent support and attention to detail.' },
      { title: 'Compliance support', text: 'We help you stay aligned with payroll requirements while your business grows.' },
    ],
  },
]

const serviceMap = Object.fromEntries(serviceList.map(s => [s.slug, s]))

interface ServicePageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return serviceList.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = serviceMap[slug]
  if (!item) return { title: 'Service not found' }
  return { title: item.title, description: item.intro }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const item = serviceMap[slug]
  if (!item) notFound()

  const related = serviceList.filter(s => s.slug !== slug)

  return (
    <main className="site-shell">
      <SiteHeader />

      <PageHero
        eyebrow="Sientax services"
        title={item.title}
        lead={item.intro}
        image={item.image}
      />

      <section className="section">
        <div className="container">
          <div className="detail-articles">
            {item.sections.map((section, i) => (
              <article className="detail-article" key={section.title}>
                <span>0{i + 1}</span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="related">
            <h3>Related services</h3>
            <div className="related-grid">
              {related.map(s => (
                <Link href={`/services/${s.slug}`} className="related-link" key={s.slug}>
                  {s.title}
                  <ArrowUpRight size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Free consultation"
        title="Let&apos;s make your next step <em>simpler.</em>"
        label="Talk to an expert"
        href="/contact"
      />

      <SiteFooter />
    </main>
  )
}
