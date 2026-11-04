import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getActiveClientFile } from '@/lib/actions/files'
import { CLIENT_STATUS_STEPS, clientTimelineIndex } from '@/lib/pipeline'

export default async function ClientHomePage() {
  const session = await getSession('client')
  if (!session?.clientId) redirect('/login')
  if (session.role === 'refer') redirect('/app/refer')

  const file = await getActiveClientFile(session.clientId, session.taxYear)
  const idx = file ? clientTimelineIndex(file.substage) : 0

  return (
    <div className="dash-card">
      <h2 style={{ marginTop: 0, fontSize: 24 }}>Welcome, {session.name.split(' ')[0]}</h2>
      {!file ? (
        <p className="dash-muted">No tax file found for {session.taxYear}. Contact your consultant or switch year.</p>
      ) : (
        <>
          <p className="dash-muted">
            File <strong>{file.fileNo}</strong> · {file.stage} / {file.substage}
          </p>
          <div className="dash-timeline">
            {CLIENT_STATUS_STEPS.map((step, i) => (
              <div key={step.label} className="dash-timeline-step">
                <div className="dash-dot" data-done={i < idx} data-current={i === idx} />
                <div>
                  <strong>{step.label}</strong>
                  <div className="dash-muted" style={{ margin: 0 }}>
                    {step.hint}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
