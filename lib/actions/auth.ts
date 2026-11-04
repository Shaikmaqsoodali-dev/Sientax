'use server'

import { eq, and, ne } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { nanoid } from 'nanoid'
import { db, clients, employees, taxFiles, passwordResetTokens } from '@/db'
import { hashPassword, verifyPassword, setSessionCookie, clearSessionCookie, updateSessionTaxYear, getSession } from '@/lib/auth'
import { hashToken } from '@/lib/crypto/pii'
import { notifyEmployee } from '@/lib/services/notifications'
import { appendHistory } from '@/lib/services/history'
import { sendEmail } from '@/lib/email'
import { allocateFileNo } from '@/lib/services/file-no'

export type ActionResult = { ok: true } | { ok: false; error: string }

export async function clientLoginAction(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')
  if (!email || !password) return { ok: false, error: 'Email and password are required' }

  const rows = await db.select().from(clients).where(eq(clients.email, email)).limit(5)
  const user = rows[0]
  if (!user) return { ok: false, error: 'Invalid email or password' }

  const check = await verifyPassword(password, user.passwordHash)
  if (!check.ok) return { ok: false, error: 'Invalid email or password' }
  if (check.needsRehash) {
    await db.update(clients).set({ passwordHash: await hashPassword(password) }).where(eq(clients.id, user.id))
  }

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

  if (user.role === 'refer' || user.registeredBy === 'refer') redirect('/app/refer')
  redirect('/app')
}

export async function staffLoginAction(formData: FormData): Promise<ActionResult> {
  const login = String(formData.get('login') || '').trim()
  const password = String(formData.get('password') || '')
  const taxYear = Number(formData.get('taxYear') || new Date().getFullYear())
  if (!login || !password) return { ok: false, error: 'Login and password are required' }

  const rows = await db.select().from(employees).where(eq(employees.login, login)).limit(1)
  const emp = rows[0]
  if (!emp || !emp.active) return { ok: false, error: 'Invalid credentials' }

  const check = await verifyPassword(password, emp.passwordHash)
  if (!check.ok) return { ok: false, error: 'Invalid credentials' }
  if (check.needsRehash) {
    await db.update(employees).set({ passwordHash: await hashPassword(password) }).where(eq(employees.id, emp.id))
  }

  const isAdmin = emp.isAdmin || emp.login.toLowerCase() === 'admin'
  await setSessionCookie('staff', {
    sub: `staff:${emp.id}`,
    portal: 'staff',
    role: isAdmin ? 'admin' : 'employee',
    name: `${emp.firstName} ${emp.lastName}`.trim(),
    email: emp.email,
    employeeId: emp.id,
    login: emp.login,
    taxYear,
  })

  if (isAdmin) redirect('/staff/employees')
  redirect('/staff')
}

export async function logoutAction(portal: 'client' | 'staff') {
  await clearSessionCookie(portal)
  redirect(portal === 'staff' ? '/staff/login' : '/login')
}

export async function switchYearAction(portal: 'client' | 'staff', year: number) {
  await updateSessionTaxYear(portal, year)
}

export async function signupAction(formData: FormData): Promise<ActionResult> {
  const firstName = String(formData.get('firstName') || '').trim()
  const middleName = String(formData.get('middleName') || '').trim()
  const lastName = String(formData.get('lastName') || '').trim()
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const phone = String(formData.get('phone') || '').trim()
  const password = String(formData.get('password') || '')
  const timeZone = String(formData.get('timeZone') || 'PT')
  const pref = String(formData.get('pref') || 'morning')
  const empId = Number(formData.get('empId') || 0)
  const referral = String(formData.get('ref') || '0').trim() || '0'
  const year = new Date().getFullYear()

  if (!firstName || !lastName || !email || !password || !empId) {
    return { ok: false, error: 'Please fill all required fields' }
  }

  const existing = await db.select().from(clients).where(eq(clients.email, email)).limit(1)
  if (existing[0]) return { ok: false, error: 'An account with this email already exists' }

  const fileNo = await allocateFileNo(year)

  const passwordHash = await hashPassword(password)
  const [client] = await db
    .insert(clients)
    .values({
      firstName,
      middleName,
      lastName,
      email,
      phone,
      passwordHash,
      registeredBy: 'self',
      fileNo,
      year,
      referral,
      timeZone,
      pref,
      role: 'client',
    })
    .returning()

  await db.insert(taxFiles).values({
    fileNo,
    clientId: client.id,
    empId,
    year,
    stage: 'Pre Process',
    substage: 'Interview Pending',
  })

  await notifyEmployee({
    empId,
    fileNo,
    title: 'New client registered',
    description: `${firstName} ${lastName} signed up for ${year}`,
  })
  await appendHistory({
    fileNo,
    year,
    employee: 'System',
    action: 'Client Signup',
    remark: `Assigned to employee #${empId}`,
  })

  await setSessionCookie('client', {
    sub: `client:${client.id}`,
    portal: 'client',
    role: 'client',
    name: `${firstName} ${lastName}`.trim(),
    email,
    clientId: client.id,
    taxYear: year,
  })

  redirect('/app')
}

export async function referSignupAction(formData: FormData): Promise<ActionResult> {
  const firstName = String(formData.get('firstName') || '').trim()
  const lastName = String(formData.get('lastName') || '').trim()
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const phone = String(formData.get('phone') || '').trim()
  const password = String(formData.get('password') || '')
  const code = String(formData.get('code') || '').trim()

  if (!firstName || !lastName || !email || !password || !code) {
    return { ok: false, error: 'All fields are required' }
  }

  const clash = await db.select().from(clients).where(eq(clients.fileNo, code)).limit(1)
  if (clash[0]) return { ok: false, error: 'Referral code already in use' }

  const passwordHash = await hashPassword(password)
  const [client] = await db
    .insert(clients)
    .values({
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      registeredBy: 'refer',
      fileNo: code,
      year: new Date().getFullYear(),
      role: 'refer',
    })
    .returning()

  await setSessionCookie('client', {
    sub: `client:${client.id}`,
    portal: 'client',
    role: 'refer',
    name: `${firstName} ${lastName}`.trim(),
    email,
    clientId: client.id,
    taxYear: new Date().getFullYear(),
  })
  redirect('/app/refer')
}

export async function forgotPasswordAction(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const portal = String(formData.get('portal') || 'client') as 'client' | 'staff'
  if (!email) return { ok: false, error: 'Email is required' }

  let subjectId = 0
  if (portal === 'client') {
    const rows = await db.select().from(clients).where(eq(clients.email, email)).limit(1)
    if (!rows[0]) return { ok: true } // do not leak
    subjectId = rows[0].id
  } else {
    const rows = await db.select().from(employees).where(eq(employees.email, email)).limit(1)
    if (!rows[0]) return { ok: true }
    subjectId = rows[0].id
  }

  const token = nanoid(48)
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60)
  await db.insert(passwordResetTokens).values({
    portal,
    subjectId,
    email,
    tokenHash: hashToken(token),
    expiresAt,
  })

  const base = process.env.APP_URL || 'http://localhost:3000'
  const link = `${base}/reset-password?token=${token}&portal=${portal}`
  await sendEmail({
    to: email,
    subject: 'Reset your Sientax password',
    html: `<p>Click to reset your password:</p><p><a href="${link}">${link}</a></p><p>This link expires in 1 hour.</p>`,
  })
  return { ok: true }
}

export async function resetPasswordAction(formData: FormData): Promise<ActionResult> {
  const token = String(formData.get('token') || '')
  const portal = String(formData.get('portal') || 'client') as 'client' | 'staff'
  const password = String(formData.get('password') || '')
  if (!token || password.length < 6) return { ok: false, error: 'Invalid token or password too short' }

  const tokenHash = hashToken(token)
  const rows = await db
    .select()
    .from(passwordResetTokens)
    .where(and(eq(passwordResetTokens.tokenHash, tokenHash), eq(passwordResetTokens.portal, portal)))
    .limit(1)
  const row = rows[0]
  if (!row || row.usedAt || row.expiresAt < new Date()) return { ok: false, error: 'Token expired or invalid' }

  const passwordHash = await hashPassword(password)
  if (portal === 'client') {
    await db.update(clients).set({ passwordHash }).where(eq(clients.id, row.subjectId))
  } else {
    await db.update(employees).set({ passwordHash }).where(eq(employees.id, row.subjectId))
  }
  await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, row.id))
  return { ok: true }
}

export async function listConsultants() {
  return db
    .select({ id: employees.id, firstName: employees.firstName, lastName: employees.lastName })
    .from(employees)
    .where(and(eq(employees.active, true), ne(employees.login, 'admin')))
}

export async function currentClientSession() {
  return getSession('client')
}

export async function currentStaffSession() {
  return getSession('staff')
}
