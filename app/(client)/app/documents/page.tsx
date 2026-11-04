import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getActiveClientFile, listDocuments } from '@/lib/actions/files'
import { DocumentUpload } from '@/components/dashboard/document-upload'
import { PageHeader } from '@/components/dashboard/page-header'
import { DEDUCTION_DOC_TYPES, REVIEW_DOC_TYPES } from '@/lib/pipeline'

export default async function ClientDocumentsPage() {
  const session = await getSession('client')
  if (!session?.clientId) redirect('/login')
  const file = await getActiveClientFile(session.clientId, session.taxYear)
  if (!file) {
    return (
      <>
        <PageHeader eyebrow="Documents" title="Documents" />
        <div className="dash-card">No file for {session.taxYear}</div>
      </>
    )
  }
  const docs = await listDocuments(file.fileNo, file.year)

  return (
    <>
      <PageHeader
        eyebrow={`File ${file.fileNo}`}
        title="Documents"
        description="Upload income documents and view post-tax files shared by your consultant."
      />
      <div className="dash-card">
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
    </>
  )
}
