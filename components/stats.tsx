'use client'

import { useEffect, useRef, useState } from 'react'

export interface StatItem {
  value: number
  suffix?: string
  prefix?: string
  label: string
}

interface StatsProps {
  items: StatItem[]
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function Stats({ items }: StatsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [displayed, setDisplayed] = useState<number[]>(items.map(i => i.value))
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting || started.current) return
        started.current = true
        const duration = 1500
        const t0 = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - t0) / duration, 1)
          const e = easeOutCubic(t)
          setDisplayed(items.map(item => Math.round(item.value * e)))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.4 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [items])

  return (
    <div ref={ref} className="stats-bar reveal reveal-up">
      {items.map((item, i) => (
        <div className="stat" key={item.label}>
          <div className="stat-value">
            {item.prefix}
            {displayed[i]}
            {item.suffix}
          </div>
          <div className="stat-label">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
