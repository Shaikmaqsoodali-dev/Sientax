import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'

export const metadata: Metadata = {
  title: 'Page not found',
}

export default function NotFound() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <PageHero
        eyebrow="404 — Page not found"
        title={
          <>
            This page took an <em>unexpected turn.</em>
          </>
        }
        lead="The page you are looking for may have been moved or no longer exists. Let’s get you back on track."
        image={{ src: '/photos/tax-documents.jpg', alt: 'Tax documents and a calculator prepared for filing' }}
      />

      <section className="section">
        <div className="container" style={{ textAlign: 'center', maxWidth: 720 }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Let’s fix that</p>
          <h2>
            Head back to a place <em>that makes sense.</em>
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 17, lineHeight: 1.75, marginTop: 18 }}>
            Or explore what we do best — from tax filing and audit support to corporate tax and payroll.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 32 }}>
            <Link href="/" className="btn btn--green">
              Back to home <ArrowRight size={16} />
            </Link>
            <Link href="/services" className="btn btn--light">
              Browse services <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
