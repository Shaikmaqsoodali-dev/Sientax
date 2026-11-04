import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { nanoid } from 'nanoid'

export type Portal = 'client' | 'staff'

export type SessionPayload = {
  sub: string
  portal: Portal
  role: 'admin' | 'employee' | 'client' | 'refer'
  name: string
  email: string
  clientId?: number
  employeeId?: number
  taxYear: number
  login?: string
}

const CLIENT_COOKIE = 'sientax_client_session'
const STAFF_COOKIE = 'sientax_staff_session'

function secretKey() {
  const s = process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || 'dev-sientax-secret-change-me'
  return new TextEncoder().encode(s)
}

export function cookieName(portal: Portal) {
  return portal === 'staff' ? STAFF_COOKIE : CLIENT_COOKIE
}

export async function createSessionToken(payload: SessionPayload, maxAgeSec = 60 * 60 * 24): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSec}s`)
    .sign(secretKey())
}

export async function readSessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function setSessionCookie(portal: Portal, payload: SessionPayload) {
  const token = await createSessionToken(payload)
  const jar = await cookies()
  jar.set(cookieName(portal), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
  return token
}

export async function clearSessionCookie(portal: Portal) {
  const jar = await cookies()
  jar.delete(cookieName(portal))
}

export async function getSession(portal: Portal): Promise<SessionPayload | null> {
  const jar = await cookies()
  const token = jar.get(cookieName(portal))?.value
  if (!token) return null
  return readSessionToken(token)
}

export async function requireSession(portal: Portal): Promise<SessionPayload> {
  const s = await getSession(portal)
  if (!s) throw new Error('Unauthorized')
  return s
}

export async function updateSessionTaxYear(portal: Portal, taxYear: number) {
  const current = await getSession(portal)
  if (!current) throw new Error('Unauthorized')
  await setSessionCookie(portal, { ...current, taxYear })
}
