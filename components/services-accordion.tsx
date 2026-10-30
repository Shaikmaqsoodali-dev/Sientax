'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Plus } from 'lucide-react'

export interface ServiceItem {
  number: string
  title: string
  description: string
  href: string
}

interface ServicesAccordionProps {
  items: ServiceItem[]
}

export function ServicesAccordion({ items }: ServicesAccordionProps) {
  const [open, setOpen] = useState(0)

  return (
    <div className="svc-accordion stagger">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div className={`svc-row reveal reveal-up${isOpen ? ' is-open' : ''}`} key={item.href}>
            <button
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="svc-num">{item.number} —</span>
              <span className="svc-title">{item.title}</span>
              <span className="svc-icon">
                <Plus size={16} />
              </span>
            </button>
            <div className={`svc-answer${isOpen ? ' is-open' : ''}`}>
              <div>
                <p>{item.description}</p>
                <Link href={item.href} className="link-arrow">
                  Learn more <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
