import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getActiveClientFile } from '@/lib/actions/files'
import { CLIENT_STATUS_STEPS, clientTimelineIndex } from '@/lib/pipeline'
import { PageHeader } from '@/components/dashboard/page-header'

export default async function ClientHomePage() {
  const session = await getSession('client')
  if (!session?.clientId) redirect('/login')
  if (session.role === 'refer') redirect('/app/refer')

  const file = await getActiveClientFile(session.clientId, session.taxYear)
  const idx = file ? clientTimelineIndex(file.substage) : 0
  const firstName = session.name.split(' ')[0] || 'there'

  return (
    <>
      <PageHeader
        eyebrow={`${session.taxYear} tax year`}
        title={`Welcome, ${firstName}`}
        description="Track your filing progress, complete your interview, and manage documents from one place."
      />

      {file ? (
        <div className="dash-stat-row">
          <div className="dash-stat">
            <p className="dash-stat-label">File number</p>
            <p className="dash-stat-value">{file.fileNo}</p>
          </div>
          <div className="dash-stat">
            <p className="dash-stat-label">Current stage</p>
            <p className="dash-stat-value" style={{ fontSize: 18 }}>
              {file.stage}
            </p>
            <p className="dash-stat-hint">{file.substage}</p>
          </div>
          <div className="dash-stat">
            <p className="dash-stat-label">Status</p>
            <p className="dash-stat-value" style={{ fontSize: 18 }}>
              <span className="dash-pill dash-pill--live">{CLIENT_STATUS_STEPS[idx]?.label || 'In progress'}</span>
            </p>
          </div>
        </div>
      ) : null}

      <div className="dash-card">
        {!file ? (
          <p className="dash-muted" style={{ margin: 0 }}>
            No tax file found for {session.taxYear}. Contact your consultant or switch year in the top bar.
          </p>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18 }}>Filing timeline</h3>
                <p className="dash-muted" style={{ margin: '6px 0 0' }}>
                  Your file moves through these steps with your consultant.
                </p>
              </div>
              <div className="dash-actions" style={{ marginTop: 0 }}>
                <Link href="/app/interview" className="dash-btn">
                  Interview sheet
                </Link>
                <Link href="/app/documents" className="dash-btn secondary">
                  Documents
                </Link>
              </div>
            </div>
            <div className="dash-timeline">
              {CLIENT_STATUS_STEPS.map((step, i) => (
                <div key={step.label} className="dash-timeline-step">
                  <div className="dash-dot" data-done={i < idx} data-current={i === idx} />
                  <div>
                    <strong>{step.label}</strong>
                    <div className="dash-muted" style={{ margin: '4px 0 0' }}>
                      {step.hint}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
