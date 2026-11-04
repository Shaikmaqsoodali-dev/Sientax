import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getTaxFileById, getInterviewBundle } from '@/lib/actions/files'
import { InterviewForm } from '@/components/dashboard/interview-form'

export default async function FileInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  const { id } = await params
  const row = await getTaxFileById(Number(id))
  if (!row) notFound()
  const bundle = await getInterviewBundle(row.file.fileNo, row.file.year)

  return (
    <div className="dash-card" style={{ maxWidth: 720 }}>
      <h3 style={{ marginTop: 0 }}>Interview sheet</h3>
      <InterviewForm
        portal="staff"
        fileNo={row.file.fileNo}
        year={row.file.year}
        fileId={row.file.id}
        initial={bundle.sheet || undefined}
        spouse={bundle.spouse || undefined}
        dependents={bundle.dependents}
      />
    </div>
  )
}
