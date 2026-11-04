import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getTaxFileById, updatePersonalInfoStaffAction } from '@/lib/actions/files'
import { AuthForm } from '@/components/dashboard/auth-form'

export default async function FilePersonalInfoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  const { id } = await params
  const row = await getTaxFileById(Number(id))
  if (!row) notFound()

  return (
    <div className="dash-card" style={{ maxWidth: 640 }}>
      <h3 style={{ marginTop: 0 }}>Personal information</h3>
      <AuthForm action={updatePersonalInfoStaffAction} submitLabel="Save">
        <input type="hidden" name="clientId" value={row.client.id} />
        <input type="hidden" name="fileId" value={row.file.id} />
        <div className="dash-grid-2">
          <label>
            First name
            <input name="firstName" defaultValue={row.client.firstName} required />
          </label>
          <label>
            Middle
            <input name="middleName" defaultValue={row.client.middleName} />
          </label>
        </div>
        <label>
          Last name
          <input name="lastName" defaultValue={row.client.lastName} required />
        </label>
        <label>
          Email
          <input name="email" type="email" defaultValue={row.client.email} required />
        </label>
        <div className="dash-grid-2">
          <label>
            Phone
            <input name="phone" defaultValue={row.client.phone} />
          </label>
          <label>
            Alt phone
            <input name="altPhone" defaultValue={row.client.altPhone} />
          </label>
        </div>
      </AuthForm>
    </div>
  )
}
