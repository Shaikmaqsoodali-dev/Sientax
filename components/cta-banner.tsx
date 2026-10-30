import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface CtaBannerProps {
  eyebrow?: string
  title: ReactNode
  label?: string
  href?: string
}

export function CtaBanner({
  eyebrow = 'Ready when you are',
  title,
  label = 'Book your free consultation',
  href = '/contact',
}: CtaBannerProps) {
  return (
    <section className="section cta-section">
      <div className="cta-banner reveal reveal-up">
        <p className="eyebrow eyebrow--lime">{eyebrow}</p>
        <h2>{title}</h2>
        <Link href={href} className="btn btn--lime">
          {label} <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  )
}
