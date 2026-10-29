'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export type FaqItem = [string, string]

interface FaqAccordionProps {
  items: FaqItem[]
  title?: string
  description?: string
  defaultOpen?: number
}

export function FaqAccordion({ items, title = 'Frequently asked questions', description, defaultOpen = 0 }: FaqAccordionProps) {
  const [openFaq, setOpenFaq] = useState(defaultOpen)

  return (
    <div className="faq-list stagger">
      <h3 className="reveal reveal-up">{title}</h3>
      {description ? <p className="faq-description reveal reveal-up">{description}</p> : null}
      {items.map(([question, answer], index) => (
        <div className="faq-item reveal reveal-up" key={question}>
          <button
            aria-expanded={openFaq === index}
            onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
          >
            <span>{question}</span>
            <ChevronDown className={openFaq === index ? 'rotate' : ''} size={19} />
          </button>
          <div className={openFaq === index ? 'faq-answer is-open' : 'faq-answer'}>
            <div>
              <p>{answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
