import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getTaxFileById, sendClientEmailAction } from '@/lib/actions/files'
import { AuthForm } from '@/components/dashboard/auth-form'

export default async function FileEmailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  const { id } = await params
  const row = await getTaxFileById(Number(id))
  if (!row) notFound()

  return (
    <div className="dash-card" style={{ maxWidth: 720 }}>
      <h3 style={{ marginTop: 0 }}>Email client</h3>
      <AuthForm action={sendClientEmailAction} submitLabel="Send email">
        <input type="hidden" name="fileId" value={row.file.id} />
        <input type="hidden" name="fileNo" value={row.file.fileNo} />
        <input type="hidden" name="year" value={row.file.year} />
        <label>
          To
          <input name="to" type="email" defaultValue={row.client.email} required />
        </label>
        <label>
          Subject
          <input name="subject" required />
        </label>
        <label>
          Body (HTML allowed)
          <textarea name="body" required rows={10} />
        </label>
      </AuthForm>
    </div>
  )
}
