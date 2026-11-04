'use client'

import { useRouter } from 'next/navigation'
import { switchYearAction } from '@/lib/actions/auth'

const YEARS = [2024, 2025, 2026, 2027]

export function YearSwitcher({ portal, year }: { portal: 'client' | 'staff'; year: number }) {
  const router = useRouter()
  return (
    <label className="dash-year">
      <span>Tax year</span>
      <select
        value={year}
        onChange={async (e) => {
          await switchYearAction(portal, Number(e.target.value))
          router.refresh()
        }}
      >
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </label>
  )
}
