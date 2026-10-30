import Image from 'next/image'
import type { ReactNode } from 'react'

interface PageHeroProps {
  eyebrow: string
  title: ReactNode
  lead?: string
  image: { src: string; alt: string }
}

export function PageHero({ eyebrow, title, lead, image }: PageHeroProps) {
  return (
    <section className="page-hero">
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" />
      <div className="page-hero__content">
        <p className="eyebrow eyebrow--lime">{eyebrow}</p>
        <h1>{title}</h1>
        {lead ? <p className="page-hero__lead">{lead}</p> : null}
      </div>
    </section>
  )
}
