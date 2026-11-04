import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getActiveClientFile, listDocuments } from '@/lib/actions/files'
import { DocumentUpload } from '@/components/dashboard/document-upload'
import { DEDUCTION_DOC_TYPES, REVIEW_DOC_TYPES } from '@/lib/pipeline'

export default async function ClientDocumentsPage() {
  const session = await getSession('client')
  if (!session?.clientId) redirect('/login')
  const file = await getActiveClientFile(session.clientId, session.taxYear)
  if (!file) return <div className="dash-card">No file for {session.taxYear}</div>
  const docs = await listDocuments(file.fileNo, file.year)

  return (
    <div className="dash-card">
      <h2 style={{ marginTop: 0, fontSize: 22 }}>Documents</h2>
      <p className="dash-muted">Upload income documents and view post-tax files for {file.fileNo}.</p>
      <DocumentUpload
        portal="client"
        fileNo={file.fileNo}
        year={file.year}
        kinds={[
          { value: 'deduction', label: 'Taxpayer document' },
          { value: 'spouse_deduction', label: 'Spouse document' },
          { value: 'review', label: 'Post-tax document' },
        ]}
        types={[...DEDUCTION_DOC_TYPES, ...REVIEW_DOC_TYPES]}
        docs={docs}
      />
    </div>
  )
}
