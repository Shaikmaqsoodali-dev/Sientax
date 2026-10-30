'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

export type FaqItem = [string, string]

interface FaqAccordionProps {
  items: FaqItem[]
  columns?: 1 | 2
  defaultOpen?: number
}

interface FaqChunk {
  items: FaqItem[]
  start: number
}

export function FaqAccordion({ items, columns = 1, defaultOpen = 0 }: FaqAccordionProps) {
  const [open, setOpen] = useState(defaultOpen)

  const chunks: FaqChunk[] = []
  if (columns === 2) {
    const half = Math.ceil(items.length / 2)
    chunks.push({ items: items.slice(0, half), start: 0 })
    chunks.push({ items: items.slice(half), start: half })
  } else {
    chunks.push({ items, start: 0 })
  }

  return (
    <div className={`faq-grid faq-grid--${columns} stagger`}>
      {chunks.map((chunk, chunkIndex) => (
        <div className="faq-col" key={chunkIndex}>
          {chunk.items.map(([question, answer], i) => {
            const idx = chunk.start + i
            const isOpen = open === idx
            return (
              <div className={`faq-item reveal reveal-up${isOpen ? ' is-open' : ''}`} key={question}>
                <button
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : idx)}
                >
                  <span className="faq-num">{String(idx + 1).padStart(2, '0')}.</span>
                  <span className="faq-q">{question}</span>
                  <span className="faq-icon">{isOpen ? <Minus size={15} /> : <Plus size={15} />}</span>
                </button>
                <div className={isOpen ? 'faq-answer is-open' : 'faq-answer'}>
                  <div>
                    <p>{answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
