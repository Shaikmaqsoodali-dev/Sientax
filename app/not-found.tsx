import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function NotFound() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="inner-hero">
        <p className="eyebrow">404 — Page not found</p>
        <h1>This page took an <em>unexpected turn.</em></h1>
        <p>The page you are looking for may have been moved or no longer exists. Let&apos;s get you back on track.</p>
        <p style={{ marginTop: 28 }}>
          <Link href="/" className="button button-dark">Back to home <ArrowUpRight size={16} /></Link>
        </p>
      </section>
      <SiteFooter />
    </main>
  )
}
