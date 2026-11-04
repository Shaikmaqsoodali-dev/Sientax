import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db, clients } from '@/db'
import { updateClientProfileAction } from '@/lib/actions/files'
import { AuthForm } from '@/components/dashboard/auth-form'

export default async function ProfilePage() {
  const session = await getSession('client')
  if (!session?.clientId) redirect('/login')
  const [user] = await db.select().from(clients).where(eq(clients.id, session.clientId)).limit(1)
  if (!user) redirect('/login')

  return (
    <div className="dash-card" style={{ maxWidth: 640 }}>
      <h2 style={{ marginTop: 0, fontSize: 22 }}>Personal information</h2>
      <AuthForm action={updateClientProfileAction} submitLabel="Save">
        <div className="dash-grid-2">
          <label>
            First name
            <input name="firstName" defaultValue={user.firstName} required />
          </label>
          <label>
            Middle name
            <input name="middleName" defaultValue={user.middleName} />
          </label>
        </div>
        <label>
          Last name
          <input name="lastName" defaultValue={user.lastName} required />
        </label>
        <label>
          Email
          <input name="email" type="email" defaultValue={user.email} required />
        </label>
        <div className="dash-grid-2">
          <label>
            Phone
            <input name="phone" defaultValue={user.phone} />
          </label>
          <label>
            Alternate phone
            <input name="altPhone" defaultValue={user.altPhone} />
          </label>
        </div>
      </AuthForm>
    </div>
  )
}
