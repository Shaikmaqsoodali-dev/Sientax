import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getActiveClientFile, getInterviewBundle } from '@/lib/actions/files'
import { InterviewForm } from '@/components/dashboard/interview-form'
import { PageHeader } from '@/components/dashboard/page-header'

export default async function ClientInterviewPage() {
  const session = await getSession('client')
  if (!session?.clientId) redirect('/login')
  const file = await getActiveClientFile(session.clientId, session.taxYear)
  if (!file) {
    return (
      <>
        <PageHeader eyebrow="Interview" title="Interview sheet" />
        <div className="dash-card">No file for {session.taxYear}</div>
      </>
    )
  }
  const bundle = await getInterviewBundle(file.fileNo, file.year)

  return (
    <>
      <PageHeader
        eyebrow={`File ${file.fileNo}`}
        title="Interview sheet"
        description="Answer these questions so your consultant can prepare an accurate return."
      />
      <div className="dash-card" style={{ maxWidth: 720 }}>
        <InterviewForm
          portal="client"
          fileNo={file.fileNo}
          year={file.year}
          initial={bundle.sheet || undefined}
          spouse={bundle.spouse || undefined}
          dependents={bundle.dependents}
        />
      </div>
    </>
  )
}
