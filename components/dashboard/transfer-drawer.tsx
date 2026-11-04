'use client'

import { useState, useTransition } from 'react'
import { transferFileAction } from '@/lib/actions/files'
import { STAGE_GROUPS, substagesForStage, type StageBucket } from '@/lib/pipeline'

type Emp = { id: number; firstName: string; lastName: string }

export function TransferDrawer({
  fileId,
  employees,
  currentStage,
  currentSubstage,
  currentEmpId,
}: {
  fileId: number
  employees: Emp[]
  currentStage: string
  currentSubstage: string
  currentEmpId: number
}) {
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState<StageBucket>((currentStage as StageBucket) || 'Pre Process')
  const [msg, setMsg] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const subs = substagesForStage(stage)

  if (!open) {
    return (
      <button type="button" className="dash-btn secondary" onClick={() => setOpen(true)}>
        Change status
      </button>
    )
  }

  return (
    <div className="dash-card" style={{ marginTop: 12, borderColor: 'var(--green-mid)' }}>
      <h3 style={{ marginTop: 0 }}>Change status / transfer</h3>
      <form
        className="dash-form"
        action={(fd) => {
          setMsg(null)
          start(async () => {
            const res = await transferFileAction(fd)
            if (res.ok) {
              setOpen(false)
              window.location.reload()
            } else setMsg(res.error)
          })
        }}
      >
        <input type="hidden" name="fileId" value={fileId} />
        <label>
          Main stage
          <select name="stage" value={stage} onChange={(e) => setStage(e.target.value as StageBucket)}>
            {STAGE_GROUPS.map((g) => (
              <option key={g.stage} value={g.stage}>
                {g.stage}
              </option>
            ))}
          </select>
        </label>
        <label>
          Substage
          <select name="substage" defaultValue={currentSubstage}>
            {subs.map((s) => (
              <option key={s.code} value={s.substage}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Assign employee
          <select name="empId" defaultValue={currentEmpId}>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.firstName} {e.lastName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Remark (required)
          <textarea name="remark" required />
        </label>
        {msg && <p className="dash-error">{msg}</p>}
        <div className="dash-actions">
          <button className="dash-btn" disabled={pending}>
            {pending ? 'Saving…' : 'Submit transfer'}
          </button>
          <button type="button" className="dash-btn secondary" onClick={() => setOpen(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
