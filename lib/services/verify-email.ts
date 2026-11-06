import { and, eq } from 'drizzle-orm'
import { db, clients, passwordResetTokens } from '@/db'
import { hashToken } from '@/lib/crypto/pii'
import { setSessionCookie } from '@/lib/auth'

export type VerifyEmailResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string }

async function signInClientById(clientId: number) {
  const [user] = await db.select().from(clients).where(eq(clients.id, clientId)).limit(1)
  if (!user) return null

  const year = user.year || new Date().getFullYear()
  await setSessionCookie('client', {
    sub: `client:${user.id}`,
    portal: 'client',
    role: user.role === 'refer' ? 'refer' : 'client',
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    clientId: user.id,
    taxYear: year,
  })
  return user
}

/** Completes verification + session. Safe to call from a Route Handler. */
export async function completeEmailVerification(token: string | null): Promise<VerifyEmailResult> {
  if (!token) return { ok: false, error: 'Missing verification token' }

  const tokenHash = hashToken(token)
  const rows = await db
    .select()
    .from(passwordResetTokens)
    .where(and(eq(passwordResetTokens.tokenHash, tokenHash), eq(passwordResetTokens.portal, 'email_verify')))
    .limit(1)
  const row = rows[0]
  if (!row || row.expiresAt < new Date()) {
    return { ok: false, error: 'This verification link is invalid or has expired.' }
  }

  if (row.usedAt) {
    const user = await signInClientById(row.subjectId)
    if (user?.emailVerified) {
      const redirectTo = user.role === 'refer' || user.registeredBy === 'refer' ? '/app/refer' : '/app'
      return { ok: true, redirectTo }
    }
    return { ok: false, error: 'This verification link is invalid or has expired.' }
  }

  const user = await signInClientById(row.subjectId)
  if (!user) return { ok: false, error: 'This verification link is invalid or has expired.' }

  await db.update(clients).set({ emailVerified: true }).where(eq(clients.id, user.id))
  await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, row.id))

  const redirectTo = user.role === 'refer' || user.registeredBy === 'refer' ? '/app/refer' : '/app'
  return { ok: true, redirectTo }
}
