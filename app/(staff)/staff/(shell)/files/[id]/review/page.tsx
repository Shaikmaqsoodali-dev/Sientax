import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getTaxFileById, listDocuments } from '@/lib/actions/files'
import { DocumentUpload } from '@/components/dashboard/document-upload'
import { REVIEW_DOC_TYPES } from '@/lib/pipeline'

export default async function FileReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  const { id } = await params
  const row = await getTaxFileById(Number(id))
  if (!row) notFound()
  const docs = (await listDocuments(row.file.fileNo, row.file.year)).filter((d) => d.kind === 'review')

  return (
    <div className="dash-card">
      <h3 style={{ marginTop: 0 }}>Client review / post-tax documents</h3>
      <DocumentUpload
        portal="staff"
        fileNo={row.file.fileNo}
        year={row.file.year}
        kinds={[{ value: 'review', label: 'Post-tax document' }]}
        types={REVIEW_DOC_TYPES}
        docs={docs}
      />
    </div>
  )
}
