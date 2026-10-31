import type { Metadata } from 'next'
import Image from 'next/image'
import { Check, User, Globe, Award, Clock, MapPin, Layers, ShieldCheck } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { CtaBanner } from '@/components/cta-banner'
import { Stats } from '@/components/stats'

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet the team of accounting professionals behind Sientax and the standards we hold ourselves to.',
}

const principles = [
  { title: 'Personalized Services', text: 'We tailor our services to fit your unique financial needs, providing a customized approach to tax consulting.', icon: User },
  { title: 'Global Expertise', text: 'Our team comprises professionals with extensive experience in various jurisdictions, allowing us to cater to a diverse clientele.', icon: Globe },
  { title: 'Commitment to Excellence', text: 'We are dedicated to maintaining the highest standards of professionalism and integrity in all our dealings.', icon: Award },
]

export default function AboutPage() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <PageHero
        eyebrow="About Sientax"
        title={
          <>
            Making a positive <em>impact.</em>
          </>
        }
        lead="We believe in building lasting relationships with our clients by offering personalized strategies that fit your unique financial needs, ensuring maximum benefits and peace of mind."
        image={{ src: '/photos/hands-computer-desk.jpg', alt: 'Aerial view of hands working at a computer on a clean white office desk' }}
      />

      <section className="section">
        <div className="band reveal reveal-scale">
          <Image src="/photos/advisor-meeting.jpg" alt="Sientax advisors reviewing client documents together" fill sizes="(max-width: 1240px) 100vw, 60vw" />
          <div className="band-note">
            <span>One team</span>
            <strong>Shared standards.</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="split-head reveal reveal-left">
            <p className="eyebrow">Our standards</p>
            <h2>
              We hold ourselves to <em>high standards.</em>
            </h2>
          </div>
          <div className="split-copy reveal reveal-right">
            <p>
              At Sientax, we are a passionate team of accounting professionals dedicated to providing
              comprehensive and reliable tax consulting and accounting services. With a diverse group of
              experts located around the globe, we bring together a wealth of knowledge and experience to
              help our clients navigate the complexities of tax regulations and financial management.
            </p>
          </div>
        </div>
      </section>

      <Stats
        items={[
          { value: 30, suffix: '+', label: 'Years of experience', icon: 'clock' },
          { value: 50, label: 'States we e-file in', icon: 'map' },
          { value: 5, label: 'Core service areas', icon: 'layers' },
          { value: 100, suffix: '%', label: 'Confidential & secure', icon: 'shield' },
        ]}
      />

      <section className="section">
        <div className="container principles-grid">
          <div className="section-head reveal reveal-left">
            <p className="eyebrow">Why choose us</p>
            <h2>
              Building trust through results and <em>integrity.</em>
            </h2>
          </div>
          <div className="checklist reveal reveal-right">
            {principles.map(({ title, text, icon: Icon }) => (
              <div className="check-item" key={title}>
                <span className="check-icon">
                  <Icon size={18} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Let&apos;s work together"
        title="Ready to take the stress out of <em>tax season?</em>"
        label="Contact us"
        href="/contact"
      />

      <SiteFooter />
    </main>
  )
}
