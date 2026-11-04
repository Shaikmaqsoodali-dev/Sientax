'use client'

import { useEffect, useState } from 'react'

const ZONES = [
  { label: 'PT', tz: 'America/Los_Angeles' },
  { label: 'MT', tz: 'America/Denver' },
  { label: 'CT', tz: 'America/Chicago' },
  { label: 'ET', tz: 'America/New_York' },
]

function fmt(tz: string, d: Date) {
  return d.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' })
}

export function UsClocks() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="dash-clocks">
      {ZONES.map((z) => (
        <span key={z.label}>
          {z.label} {fmt(z.tz, now)}
        </span>
      ))}
    </div>
  )
}
