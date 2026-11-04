'use client'

import { useState, useTransition } from 'react'
import { createEstimateAction } from '@/lib/actions/files'

type Item = { label: string; amount: number; kind: string }

export function EstimateBuilder({ fileNo, year, fileId }: { fileNo: string; year: number; fileId: number }) {
  const [items, setItems] = useState<Item[]>([
    { label: 'Federal', amount: 0, kind: 'federal' },
    { label: 'State', amount: 0, kind: 'state' },
    { label: 'Preparation fee', amount: 0, kind: 'fee' },
  ])
  const [msg, setMsg] = useState<string | null>(null)
  const [pending, start] = useTransition()

  return (
    <form
      className="dash-form"
      action={(fd) => {
        setMsg(null)
        start(async () => {
          const res = await createEstimateAction(fd)
          setMsg(res.ok ? 'Estimate sent' : res.error)
        })
      }}
    >
      <input type="hidden" name="fileNo" value={fileNo} />
      <input type="hidden" name="year" value={year} />
      <input type="hidden" name="fileId" value={fileId} />
      <input type="hidden" name="lineItems" value={JSON.stringify(items)} />
      {items.map((item, i) => (
        <div key={i} className="dash-grid-2">
          <label>
            Label
            <input
              value={item.label}
              onChange={(e) => setItems((arr) => arr.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))}
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
      <button
        type="button"
        className="dash-btn secondary"
        onClick={() => setItems((x) => [...x, { label: 'Other', amount: 0, kind: 'other' }])}
      >
        Add line
      </button>
      <label>
        Narrative / HTML body
        <textarea name="body" />
      </label>
      <label>
        Remark
        <input name="remark" />
      </label>
      {msg && <p className={msg.includes('sent') ? 'dash-muted' : 'dash-error'}>{msg}</p>}
      <button className="dash-btn" disabled={pending}>
        {pending ? 'Saving…' : 'Send estimate'}
      </button>
    </form>
  )
}
