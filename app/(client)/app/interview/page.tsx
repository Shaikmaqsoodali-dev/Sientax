import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getActiveClientFile, getInterviewBundle } from '@/lib/actions/files'
import { InterviewForm } from '@/components/dashboard/interview-form'

export default async function ClientInterviewPage() {
  const session = await getSession('client')
  if (!session?.clientId) redirect('/login')
  const file = await getActiveClientFile(session.clientId, session.taxYear)
  if (!file) return <div className="dash-card">No file for {session.taxYear}</div>
  const bundle = await getInterviewBundle(file.fileNo, file.year)

  return (
    <div className="dash-card" style={{ maxWidth: 720 }}>
      <h2 style={{ marginTop: 0, fontSize: 22 }}>Interview sheet</h2>
      <p className="dash-muted">File {file.fileNo}</p>
      <InterviewForm
        portal="client"
        fileNo={file.fileNo}
        year={file.year}
        initial={bundle.sheet || undefined}
        spouse={bundle.spouse || undefined}
        dependents={bundle.dependents}
      />
    </div>
  )
}
