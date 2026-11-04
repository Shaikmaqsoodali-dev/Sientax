'use client'

import { useState, useTransition } from 'react'
import { uploadDocumentAction, downloadDocumentAction } from '@/lib/actions/files'

type Doc = {
  id: number
  type: string
  kind: string
  originalName: string
  legacyMissing: boolean
  createdAt: Date | string
}

export function DocumentUpload({
  portal,
  fileNo,
  year,
  kinds,
  types,
  docs,
}: {
  portal: 'client' | 'staff'
  fileNo: string
  year: number
  kinds: { value: string; label: string }[]
  types: readonly string[]
  docs: Doc[]
}) {
  const [msg, setMsg] = useState<string | null>(null)
  const [pending, start] = useTransition()

  return (
    <div>
      <form
        className="dash-form"
        action={(fd) => {
          setMsg(null)
          start(async () => {
            const res = await uploadDocumentAction(fd)
            setMsg(res.ok ? 'Uploaded' : res.error)
          })
        }}
      >
        <input type="hidden" name="portal" value={portal} />
        <input type="hidden" name="fileNo" value={fileNo} />
        <input type="hidden" name="year" value={year} />
        <div className="dash-grid-2">
          <label>
            Kind
            <select name="kind" defaultValue={kinds[0]?.value}>
              {kinds.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Type
            <select name="type" defaultValue={types[0]}>
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          File
          <input name="file" type="file" required accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx" />
        </label>
        <label>
          Remarks
          <input name="remarks" />
        </label>
        {msg && <p className={msg === 'Uploaded' ? 'dash-muted' : 'dash-error'}>{msg}</p>}
        <button className="dash-btn" disabled={pending}>
          {pending ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      <h3 style={{ marginTop: 28 }}>Uploaded</h3>
      <table className="dash-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Kind</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {docs.map((d) => (
            <tr key={d.id}>
              <td>{d.type}</td>
              <td>
                {d.originalName || '—'}
                {d.legacyMissing ? ' (legacy missing)' : ''}
              </td>
              <td>{d.kind}</td>
              <td>
                {!d.legacyMissing && (
                  <button
                    type="button"
                    className="dash-btn secondary"
                    onClick={async () => {
                      const res = await downloadDocumentAction(d.id)
                      if (res.ok && 'url' in res) window.open(res.url, '_blank')
                      else setMsg(res.ok ? null : res.error)
                    }}
                  >
                    Download
                  </button>
                )}
              </td>
            </tr>
          ))}
          {!docs.length && (
            <tr>
              <td colSpan={4}>No documents yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
