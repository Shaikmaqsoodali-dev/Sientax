'use client'

import { useState, useTransition } from 'react'
import { saveInterviewAction } from '@/lib/actions/files'

type Dep = { firstName: string; middleName: string; lastName: string; relation: string; dateOfBirth: string; ssnFull?: string }

type Props = {
  portal: 'client' | 'staff'
  fileNo: string
  year: number
  fileId?: number
  initial?: {
    maritalStatus?: string
    ssnFull?: string
    dateOfMarriage?: string
    dateOfBirth?: string
    currentVisaCategory?: string
    currentAddress?: string
    occupation?: string
    currentCity?: string
    currentState?: string
    zipcode?: string
    comment?: string
  }
  spouse?: {
    firstName?: string
    middleName?: string
    lastName?: string
    email?: string
    phone?: string
    ssnFull?: string
    dateOfBirth?: string
    currentVisaCategory?: string
    occupation?: string
    currentAddress?: string
    currentCity?: string
    currentState?: string
    zipcode?: string
    comment?: string
  } | null
  dependents?: Dep[]
}

export function InterviewForm({ portal, fileNo, year, fileId, initial, spouse, dependents = [] }: Props) {
  const [marital, setMarital] = useState(initial?.maritalStatus || 'Single')
  const [deps, setDeps] = useState<Dep[]>(dependents.length ? dependents : [])
  const [msg, setMsg] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const showSpouse = /married/i.test(marital)

  return (
    <form
      className="dash-form"
      action={(fd) => {
        setMsg(null)
        start(async () => {
          const res = await saveInterviewAction(fd)
          setMsg(res.ok ? 'Saved' : res.error)
        })
      }}
    >
      <input type="hidden" name="portal" value={portal} />
      <input type="hidden" name="fileNo" value={fileNo} />
      <input type="hidden" name="year" value={year} />
      <input type="hidden" name="fileId" value={fileId || ''} />
      <input type="hidden" name="dependentCount" value={deps.length} />

      <h3 style={{ margin: '8px 0' }}>Taxpayer</h3>
      <label>
        Marital status
        <select name="maritalStatus" value={marital} onChange={(e) => setMarital(e.target.value)}>
          {['Single', 'Married', 'Married Filing Separately', 'Head of Household', 'Widowed'].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </label>
      <div className="dash-grid-2">
        <label>
          SSN
          <input name="ssn" defaultValue={initial?.ssnFull || ''} autoComplete="off" />
        </label>
        <label>
          Date of birth
          <input name="dateOfBirth" defaultValue={initial?.dateOfBirth || ''} />
        </label>
      </div>
      <div className="dash-grid-2">
        <label>
          Date of marriage
          <input name="dateOfMarriage" defaultValue={initial?.dateOfMarriage || ''} />
        </label>
        <label>
          Visa category
          <input name="currentVisaCategory" defaultValue={initial?.currentVisaCategory || ''} />
        </label>
      </div>
      <label>
        Occupation
        <input name="occupation" defaultValue={initial?.occupation || ''} />
      </label>
      <label>
        Address
        <input name="currentAddress" defaultValue={initial?.currentAddress || ''} />
      </label>
      <div className="dash-grid-2">
        <label>
          City
          <input name="currentCity" defaultValue={initial?.currentCity || ''} />
        </label>
        <label>
          State
          <input name="currentState" defaultValue={initial?.currentState || ''} />
        </label>
      </div>
      <label>
        ZIP
        <input name="zipcode" defaultValue={initial?.zipcode || ''} />
      </label>
      <label>
        Comment
        <textarea name="comment" defaultValue={initial?.comment || ''} />
      </label>

      {showSpouse && (
        <>
          <h3>Spouse</h3>
          <div className="dash-grid-2">
            <label>
              First name
              <input name="spouseFirstName" defaultValue={spouse?.firstName || ''} />
            </label>
            <label>
              Middle
              <input name="spouseMiddleName" defaultValue={spouse?.middleName || ''} />
            </label>
          </div>
          <label>
            Last name
            <input name="spouseLastName" defaultValue={spouse?.lastName || ''} />
          </label>
          <div className="dash-grid-2">
            <label>
              Email
              <input name="spouseEmail" defaultValue={spouse?.email || ''} />
            </label>
            <label>
              Phone
              <input name="spousePhone" defaultValue={spouse?.phone || ''} />
            </label>
          </div>
          <div className="dash-grid-2">
            <label>
              SSN
              <input name="spouseSsn" defaultValue={spouse?.ssnFull || ''} autoComplete="off" />
            </label>
            <label>
              DOB
              <input name="spouseDateOfBirth" defaultValue={spouse?.dateOfBirth || ''} />
            </label>
          </div>
          <label>
            Visa
            <input name="spouseVisa" defaultValue={spouse?.currentVisaCategory || ''} />
          </label>
          <label>
            Occupation
            <input name="spouseOccupation" defaultValue={spouse?.occupation || ''} />
          </label>
          <label>
            Address
            <input name="spouseAddress" defaultValue={spouse?.currentAddress || ''} />
          </label>
          <div className="dash-grid-2">
            <label>
              City
              <input name="spouseCity" defaultValue={spouse?.currentCity || ''} />
            </label>
            <label>
              State
              <input name="spouseState" defaultValue={spouse?.currentState || ''} />
            </label>
          </div>
          <label>
            ZIP
            <input name="spouseZip" defaultValue={spouse?.zipcode || ''} />
          </label>
          <label>
            Comment
            <textarea name="spouseComment" defaultValue={spouse?.comment || ''} />
          </label>
        </>
      )}

      <h3>Dependents</h3>
      {deps.map((d, i) => (
        <div key={i} className="dash-card" style={{ padding: 12, marginBottom: 8 }}>
          <div className="dash-grid-2">
            <label>
              First
              <input name={`depFirstName_${i}`} defaultValue={d.firstName} />
            </label>
            <label>
              Last
              <input name={`depLastName_${i}`} defaultValue={d.lastName} />
            </label>
          </div>
          <input type="hidden" name={`depMiddleName_${i}`} defaultValue={d.middleName || ' '} />
          <div className="dash-grid-2">
            <label>
              Relation
              <input name={`depRelation_${i}`} defaultValue={d.relation} />
            </label>
            <label>
              DOB
              <input name={`depDob_${i}`} defaultValue={d.dateOfBirth} />
            </label>
          </div>
          <label>
            SSN
            <input name={`depSsn_${i}`} defaultValue={d.ssnFull || ''} autoComplete="off" />
          </label>
        </div>
      ))}
      <button
        type="button"
        className="dash-btn secondary"
        onClick={() => setDeps((x) => [...x, { firstName: '', middleName: ' ', lastName: '', relation: '', dateOfBirth: '' }])}
      >
        Add dependent
      </button>

      {msg && <p className={msg === 'Saved' ? 'dash-muted' : 'dash-error'}>{msg}</p>}
      <button type="submit" className="dash-btn" disabled={pending}>
        {pending ? 'Saving…' : 'Save interview'}
      </button>
    </form>
  )
}
