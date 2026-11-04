'use client'

import { useState, useTransition } from 'react'
import { createInvoiceAction } from '@/lib/actions/files'

type Item = { description: string; amount: number; quantity: number }

export function InvoiceBuilder({
  defaultFileNo,
  year,
}: {
  defaultFileNo?: string
  year: number
}) {
  const [items, setItems] = useState<Item[]>([{ description: 'Tax preparation', amount: 0, quantity: 1 }])
  const [msg, setMsg] = useState<string | null>(null)
  const [pending, start] = useTransition()

  return (
    <form
      className="dash-form"
      action={(fd) => {
        setMsg(null)
        start(async () => {
          const res = await createInvoiceAction(fd)
          setMsg(res.ok ? `Invoice #${res.id} created` : res.error)
        })
      }}
    >
      <input type="hidden" name="year" value={year} />
      <input type="hidden" name="lineItems" value={JSON.stringify(items)} />
      <div className="dash-grid-2">
        <label>
          File no
          <input name="fileNo" defaultValue={defaultFileNo || ''} required />
        </label>
        <label>
          Client name
          <input name="name" required />
        </label>
      </div>
      <label>
        Address
        <input name="address" />
      </label>
      {items.map((item, i) => (
        <div key={i} className="dash-grid-2">
          <label>
            Description
            <input
              value={item.description}
              onChange={(e) => setItems((arr) => arr.map((x, idx) => (idx === i ? { ...x, description: e.target.value } : x)))}
            />
          </label>
          <label>
            Amount
            <input
              type="number"
              step="0.01"
              value={item.amount}
              onChange={(e) =>
                setItems((arr) => arr.map((x, idx) => (idx === i ? { ...x, amount: Number(e.target.value) } : x)))
              }
            />
          </label>
        </div>
      ))}
      <button type="button" className="dash-btn secondary" onClick={() => setItems((x) => [...x, { description: '', amount: 0, quantity: 1 }])}>
        Add line
      </button>
      <div className="dash-grid-2">
        <label>
          Coupon
          <input name="coupon" defaultValue="none" />
        </label>
        <label>
          Referral credit
          <input name="referral" defaultValue="none" />
        </label>
      </div>
      {msg && <p className="dash-muted">{msg}</p>}
      <button className="dash-btn" disabled={pending}>
        {pending ? 'Saving…' : 'Create invoice'}
      </button>
    </form>
  )
}
