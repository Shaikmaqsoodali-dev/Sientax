'use server'

import { and, eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import {
  db,
  taxFiles,
  clients,
  employees,
  estimates,
  invoices,
  payments,
  documents,
  interviewSheets,
  interviewSheetSpouses,
  dependents,
  mails,
  notifications,
} from '@/db'
import { getSession } from '@/lib/auth'
import { hashPassword } from '@/lib/auth/password'
import { canAccessFile, assertStaff, assertAdmin, isAdmin } from '@/lib/rbac'
import { byCode, substagesForStage, type StageBucket } from '@/lib/pipeline'
import { appendHistory } from '@/lib/services/history'
import { notifyEmployee, notifyClient } from '@/lib/services/notifications'
import { allocateFileNo } from '@/lib/services/file-no'
import { encryptPii, decryptPii, maskSsn } from '@/lib/crypto/pii'
import { putObject, getDownloadUrl, assertSafeUpload } from '@/lib/files/storage'
import { sendEmail } from '@/lib/email'
import type { EstimateLineItem, InvoiceLineItem } from '@/db/schema'

export async function getActiveClientFile(clientId: number, year: number) {
  const rows = await db
    .select()
    .from(taxFiles)
    .where(and(eq(taxFiles.clientId, clientId), eq(taxFiles.year, year)))
    .limit(1)
  return rows[0] || null
}

export async function listStaffFiles(opts: {
  year: number
  empId?: number
  isAdmin: boolean
  stageCode?: number
  q?: string
}) {
  const conditions = [eq(taxFiles.year, opts.year)]
  if (!opts.isAdmin && opts.empId) conditions.push(eq(taxFiles.empId, opts.empId))
  if (opts.stageCode) {
    const def = byCode(opts.stageCode)
    if (def) conditions.push(eq(taxFiles.substage, def.substage))
  }

  const rows = await db
    .select({
      id: taxFiles.id,
      fileNo: taxFiles.fileNo,
      year: taxFiles.year,
      stage: taxFiles.stage,
      substage: taxFiles.substage,
      empId: taxFiles.empId,
      clientId: taxFiles.clientId,
      firstName: clients.firstName,
      lastName: clients.lastName,
      email: clients.email,
      phone: clients.phone,
    })
    .from(taxFiles)
    .innerJoin(clients, eq(taxFiles.clientId, clients.id))
    .where(and(...conditions))
    .orderBy(desc(taxFiles.updatedAt))
    .limit(500)

  if (!opts.q) return rows
  const q = opts.q.toLowerCase()
  return rows.filter(
    (r) =>
      r.fileNo.includes(q) ||
      r.firstName.toLowerCase().includes(q) ||
      r.lastName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q),
  )
}

export async function getTaxFileById(id: number) {
  const rows = await db
    .select({
      file: taxFiles,
      client: clients,
      employee: employees,
    })
    .from(taxFiles)
    .innerJoin(clients, eq(taxFiles.clientId, clients.id))
    .leftJoin(employees, eq(taxFiles.empId, employees.id))
    .where(eq(taxFiles.id, id))
    .limit(1)
  return rows[0] || null
}

export async function transferFileAction(formData: FormData) {
  const session = await getSession('staff')
  if (!session) return { ok: false as const, error: 'Unauthorized' }
  assertStaff(session)

  const fileId = Number(formData.get('fileId'))
  const stage = String(formData.get('stage') || '') as StageBucket
  const substage = String(formData.get('substage') || '')
  const empId = Number(formData.get('empId'))
  const remark = String(formData.get('remark') || '').trim()
  if (!fileId || !stage || !substage || !empId || !remark) {
    return { ok: false as const, error: 'Stage, substage, employee, and remark are required' }
  }

  const allowed = substagesForStage(stage).some((s) => s.substage === substage)
  if (!allowed) return { ok: false as const, error: 'Invalid stage/substage pair' }

  const row = await getTaxFileById(fileId)
  if (!row) return { ok: false as const, error: 'File not found' }
  if (!canAccessFile(session, row.file)) return { ok: false as const, error: 'Forbidden' }

  const dest = await db.select().from(employees).where(eq(employees.id, empId)).limit(1)
  const destName = dest[0] ? `${dest[0].firstName} ${dest[0].lastName}` : `#${empId}`

  await db
    .update(taxFiles)
    .set({ stage, substage, empId, updatedAt: new Date() })
    .where(eq(taxFiles.id, fileId))

  await appendHistory({
    fileNo: row.file.fileNo,
    year: row.file.year,
    employee: session.name,
    action: `File Transferred to ${destName} > ${stage} - ${substage}`,
    remark,
  })
  await notifyEmployee({
    empId,
    fileNo: row.file.fileNo,
    title: 'File transferred to you',
    description: `${row.file.fileNo} · ${stage} / ${substage}`,
  })

  revalidatePath('/staff')
  revalidatePath(`/staff/files/${fileId}`)
  return { ok: true as const }
}

export async function staffRegisterClientAction(formData: FormData) {
  const session = await getSession('staff')
  if (!session) return { ok: false as const, error: 'Unauthorized' }
  assertStaff(session)

  const firstName = String(formData.get('firstName') || '').trim()
  const middleName = String(formData.get('middleName') || '').trim()
  const lastName = String(formData.get('lastName') || '').trim()
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const phone = String(formData.get('phone') || '').trim()
  const password = String(formData.get('password') || '')
  const timeZone = String(formData.get('timeZone') || 'PT')
  const pref = String(formData.get('pref') || 'morning')
  let empId = Number(formData.get('empId') || 0)
  const year = session.taxYear

  if (!isAdmin(session)) empId = session.employeeId!
  if (!firstName || !lastName || !email || !password || !empId) {
    return { ok: false as const, error: 'Required fields missing' }
  }

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
      registeredBy: session.name,
      fileNo,
      year,
      timeZone,
      pref,
      role: 'client',
    })
    .returning()

  const [file] = await db
    .insert(taxFiles)
    .values({
      fileNo,
      clientId: client.id,
      empId,
      year,
      stage: 'Pre Process',
      substage: 'Interview Pending',
    })
    .returning()

  await notifyEmployee({
    empId,
    fileNo,
    title: 'New file registered',
    description: `${firstName} ${lastName}`,
  })
  await appendHistory({
    fileNo,
    year,
    employee: session.name,
    action: 'Staff Registration',
    remark: 'Interview Pending',
  })

  revalidatePath('/staff')
  return { ok: true as const, fileId: file.id }
}

export async function updateClientProfileAction(formData: FormData) {
  const session = await getSession('client')
  if (!session?.clientId) return { ok: false as const, error: 'Unauthorized' }

  await db
    .update(clients)
    .set({
      firstName: String(formData.get('firstName') || ''),
      middleName: String(formData.get('middleName') || ''),
      lastName: String(formData.get('lastName') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      altPhone: String(formData.get('altPhone') || ''),
    })
    .where(eq(clients.id, session.clientId))

  revalidatePath('/app/profile')
  return { ok: true as const }
}

export async function updatePersonalInfoStaffAction(formData: FormData) {
  const session = await getSession('staff')
  if (!session) return { ok: false as const, error: 'Unauthorized' }
  const clientId = Number(formData.get('clientId'))
  const fileId = Number(formData.get('fileId'))
  await db
    .update(clients)
    .set({
      firstName: String(formData.get('firstName') || ''),
      middleName: String(formData.get('middleName') || ''),
      lastName: String(formData.get('lastName') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      altPhone: String(formData.get('altPhone') || ''),
    })
    .where(eq(clients.id, clientId))
  revalidatePath(`/staff/files/${fileId}`)
  return { ok: true as const }
}

export async function saveInterviewAction(formData: FormData) {
  const portal = String(formData.get('portal') || 'client') as 'client' | 'staff'
  const session = await getSession(portal)
  if (!session) return { ok: false as const, error: 'Unauthorized' }

  const fileNo = String(formData.get('fileNo') || '')
  const year = Number(formData.get('year') || 0)
  const fileId = Number(formData.get('fileId') || 0)

  const payload = {
    maritalStatus: String(formData.get('maritalStatus') || ''),
    ssnEncrypted: encryptPii(String(formData.get('ssn') || '')),
    dateOfMarriage: String(formData.get('dateOfMarriage') || ''),
    dateOfBirth: String(formData.get('dateOfBirth') || ''),
    currentVisaCategory: String(formData.get('currentVisaCategory') || ''),
    currentAddress: String(formData.get('currentAddress') || ''),
    occupation: String(formData.get('occupation') || ''),
    currentCity: String(formData.get('currentCity') || ''),
    currentState: String(formData.get('currentState') || ''),
    zipcode: String(formData.get('zipcode') || ''),
    comment: String(formData.get('comment') || ' '),
    updatedAt: new Date(),
  }

  const existing = await db
    .select()
    .from(interviewSheets)
    .where(and(eq(interviewSheets.fileNo, fileNo), eq(interviewSheets.year, year)))
    .limit(1)

  if (existing[0]) {
    await db.update(interviewSheets).set(payload).where(eq(interviewSheets.id, existing[0].id))
  } else {
    await db.insert(interviewSheets).values({ fileNo, year, ...payload })
  }

  const married = /married/i.test(payload.maritalStatus)
  if (married) {
    const spouse = {
      firstName: String(formData.get('spouseFirstName') || ''),
      middleName: String(formData.get('spouseMiddleName') || ''),
      lastName: String(formData.get('spouseLastName') || ''),
      email: String(formData.get('spouseEmail') || ''),
      phone: String(formData.get('spousePhone') || ''),
      maritalStatus: payload.maritalStatus,
      ssnEncrypted: encryptPii(String(formData.get('spouseSsn') || '')),
      dateOfMarriage: String(formData.get('spouseDateOfMarriage') || payload.dateOfMarriage),
      dateOfBirth: String(formData.get('spouseDateOfBirth') || ''),
      currentVisaCategory: String(formData.get('spouseVisa') || ''),
      currentAddress: String(formData.get('spouseAddress') || ''),
      occupation: String(formData.get('spouseOccupation') || ''),
      currentCity: String(formData.get('spouseCity') || ''),
      currentState: String(formData.get('spouseState') || ''),
      zipcode: String(formData.get('spouseZip') || ''),
      comment: String(formData.get('spouseComment') || ' '),
      updatedAt: new Date(),
    }
    const sp = await db
      .select()
      .from(interviewSheetSpouses)
      .where(and(eq(interviewSheetSpouses.fileNo, fileNo), eq(interviewSheetSpouses.year, year)))
      .limit(1)
    if (sp[0]) await db.update(interviewSheetSpouses).set(spouse).where(eq(interviewSheetSpouses.id, sp[0].id))
    else await db.insert(interviewSheetSpouses).values({ fileNo, year, ...spouse })
  }

  // Dependents: clear and re-insert simple list
  const depCount = Number(formData.get('dependentCount') || 0)
  await db.delete(dependents).where(and(eq(dependents.fileNo, fileNo), eq(dependents.year, year)))
  for (let i = 0; i < depCount; i++) {
    const firstName = String(formData.get(`depFirstName_${i}`) || '').trim()
    if (!firstName) continue
    await db.insert(dependents).values({
      fileNo,
      year,
      firstName,
      middleName: String(formData.get(`depMiddleName_${i}`) || ' '),
      lastName: String(formData.get(`depLastName_${i}`) || ''),
      relation: String(formData.get(`depRelation_${i}`) || ''),
      dateOfBirth: String(formData.get(`depDob_${i}`) || ''),
      ssnEncrypted: encryptPii(String(formData.get(`depSsn_${i}`) || '')),
    })
  }

  await appendHistory({
    fileNo,
    year,
    employee: session.name,
    action: 'Interview updated',
    remark: portal,
  })

  if (fileId) revalidatePath(`/staff/files/${fileId}`)
  revalidatePath('/app/interview')
  return { ok: true as const }
}

export async function getInterviewBundle(fileNo: string, year: number) {
  const [sheet] = await db
    .select()
    .from(interviewSheets)
    .where(and(eq(interviewSheets.fileNo, fileNo), eq(interviewSheets.year, year)))
    .limit(1)
  const [spouse] = await db
    .select()
    .from(interviewSheetSpouses)
    .where(and(eq(interviewSheetSpouses.fileNo, fileNo), eq(interviewSheetSpouses.year, year)))
    .limit(1)
  const deps = await db
    .select()
    .from(dependents)
    .where(and(eq(dependents.fileNo, fileNo), eq(dependents.year, year)))

  return {
    sheet: sheet
      ? { ...sheet, ssn: sheet.ssnEncrypted ? maskSsn(decryptPii(sheet.ssnEncrypted)) : '', ssnFull: decryptPii(sheet.ssnEncrypted) }
      : null,
    spouse: spouse
      ? { ...spouse, ssn: spouse.ssnEncrypted ? maskSsn(decryptPii(spouse.ssnEncrypted)) : '', ssnFull: decryptPii(spouse.ssnEncrypted) }
      : null,
    dependents: deps.map((d) => ({
      ...d,
      ssn: d.ssnEncrypted ? maskSsn(decryptPii(d.ssnEncrypted)) : '',
      ssnFull: decryptPii(d.ssnEncrypted),
    })),
  }
}

export async function uploadDocumentAction(formData: FormData) {
  const portal = String(formData.get('portal') || 'client') as 'client' | 'staff'
  const session = await getSession(portal)
  if (!session) return { ok: false as const, error: 'Unauthorized' }

  const fileNo = String(formData.get('fileNo') || '')
  const year = Number(formData.get('year') || 0)
  const type = String(formData.get('type') || 'Other')
  const kind = String(formData.get('kind') || 'deduction') as 'deduction' | 'spouse_deduction' | 'review' | 'other'
  const remarks = String(formData.get('remarks') || '')
  const file = formData.get('file')
  if (!(file instanceof File) || !file.size) return { ok: false as const, error: 'File required' }

  const buf = Buffer.from(await file.arrayBuffer())
  try {
    assertSafeUpload(file.name, file.type || 'application/octet-stream', buf.length)
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : 'Invalid file' }
  }

  const { storageKey, sizeBytes } = await putObject({
    fileNo,
    year,
    originalName: file.name,
    mimeType: file.type || 'application/octet-stream',
    body: buf,
  })

  await db.insert(documents).values({
    fileNo,
    year,
    kind,
    type,
    originalName: file.name,
    storageKey,
    mimeType: file.type || 'application/octet-stream',
    sizeBytes,
    uploaderRole: session.role,
    remarks,
    legacyMissing: false,
  })

  const [tf] = await db
    .select()
    .from(taxFiles)
    .where(and(eq(taxFiles.fileNo, fileNo), eq(taxFiles.year, year)))
    .limit(1)
  if (tf) {
    await notifyEmployee({
      empId: tf.empId,
      fileNo,
      title: 'Document uploaded',
      description: `${type} · ${file.name}`,
    })
  }

  await appendHistory({
    fileNo,
    year,
    employee: session.name,
    action: 'Document uploaded',
    remark: `${type}: ${file.name}`,
  })

  revalidatePath('/app/documents')
  return { ok: true as const }
}

export async function listDocuments(fileNo: string, year: number) {
  return db
    .select()
    .from(documents)
    .where(and(eq(documents.fileNo, fileNo), eq(documents.year, year)))
    .orderBy(desc(documents.createdAt))
}

export async function downloadDocumentAction(documentId: number) {
  const [doc] = await db.select().from(documents).where(eq(documents.id, documentId)).limit(1)
  if (!doc) return { ok: false as const, error: 'Not found' }

  const staff = await getSession('staff')
  const client = await getSession('client')
  if (!staff && !client) return { ok: false as const, error: 'Unauthorized' }

  if (client?.clientId) {
    const [tf] = await db
      .select()
      .from(taxFiles)
      .where(and(eq(taxFiles.fileNo, doc.fileNo), eq(taxFiles.year, doc.year), eq(taxFiles.clientId, client.clientId)))
      .limit(1)
    if (!tf) return { ok: false as const, error: 'Forbidden' }
  }

  try {
    const url = await getDownloadUrl(doc.storageKey)
    await appendHistory({
      fileNo: doc.fileNo,
      year: doc.year,
      employee: staff?.name || client?.name || 'user',
      action: 'Document downloaded',
      remark: doc.originalName || doc.storageKey,
    })
    return { ok: true as const, url }
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : 'Unavailable' }
  }
}

export async function createEstimateAction(formData: FormData) {
  const session = await getSession('staff')
  if (!session) return { ok: false as const, error: 'Unauthorized' }

  const fileNo = String(formData.get('fileNo') || '')
  const year = Number(formData.get('year') || 0)
  const fileId = Number(formData.get('fileId') || 0)
  const remark = String(formData.get('remark') || '')
  const body = String(formData.get('body') || '')
  const rawItems = String(formData.get('lineItems') || '[]')
  let lineItems: EstimateLineItem[] = []
  try {
    lineItems = JSON.parse(rawItems)
  } catch {
    return { ok: false as const, error: 'Invalid line items' }
  }

  const [est] = await db
    .insert(estimates)
    .values({
      fileNo,
      year,
      body,
      lineItems,
      remark,
      createdBy: session.name,
      status: 'sent',
    })
    .returning()

  await db
    .update(taxFiles)
    .set({ stage: 'Process', substage: 'Estimates Pending', updatedAt: new Date() })
    .where(and(eq(taxFiles.fileNo, fileNo), eq(taxFiles.year, year)))

  const [tf] = await db
    .select()
    .from(taxFiles)
    .where(and(eq(taxFiles.fileNo, fileNo), eq(taxFiles.year, year)))
    .limit(1)
  if (tf) {
    await notifyClient({
      clientId: tf.clientId,
      fileNo,
      title: 'New tax estimate',
      description: 'Please review and accept your estimate',
    })
  }

  await appendHistory({
    fileNo,
    year,
    employee: session.name,
    action: 'Estimate created',
    remark,
  })

  revalidatePath(`/staff/files/${fileId}`)
  return { ok: true as const, id: est.id }
}

export async function acceptEstimateAction(estimateId: number) {
  const session = await getSession('client')
  if (!session?.clientId) return { ok: false as const, error: 'Unauthorized' }

  const [est] = await db.select().from(estimates).where(eq(estimates.id, estimateId)).limit(1)
  if (!est) return { ok: false as const, error: 'Not found' }

  const [tf] = await db
    .select()
    .from(taxFiles)
    .where(and(eq(taxFiles.fileNo, est.fileNo), eq(taxFiles.year, est.year), eq(taxFiles.clientId, session.clientId)))
    .limit(1)
  if (!tf) return { ok: false as const, error: 'Forbidden' }

  await db.update(estimates).set({ status: 'accepted' }).where(eq(estimates.id, estimateId))
  await db
    .update(taxFiles)
    .set({ stage: 'Process', substage: 'Payment Pending', updatedAt: new Date() })
    .where(eq(taxFiles.id, tf.id))

  await notifyEmployee({
    empId: tf.empId,
    fileNo: est.fileNo,
    title: 'Estimate accepted',
    description: `${session.name} accepted estimate #${estimateId}`,
  })
  await appendHistory({
    fileNo: est.fileNo,
    year: est.year,
    employee: session.name,
    action: 'Estimate accepted',
    remark: `Estimate #${estimateId}`,
  })

  revalidatePath('/app/estimates')
  return { ok: true as const }
}

export async function rejectEstimateAction(estimateId: number) {
  const session = await getSession('client')
  if (!session?.clientId) return { ok: false as const, error: 'Unauthorized' }
  const [est] = await db.select().from(estimates).where(eq(estimates.id, estimateId)).limit(1)
  if (!est) return { ok: false as const, error: 'Not found' }
  await db.update(estimates).set({ status: 'rejected' }).where(eq(estimates.id, estimateId))
  revalidatePath('/app/estimates')
  return { ok: true as const }
}

export async function createInvoiceAction(formData: FormData) {
  const session = await getSession('staff')
  if (!session) return { ok: false as const, error: 'Unauthorized' }

  const fileNo = String(formData.get('fileNo') || '')
  const year = Number(formData.get('year') || session.taxYear)
  const name = String(formData.get('name') || '')
  const address = String(formData.get('address') || '')
  const coupon = String(formData.get('coupon') || 'none')
  const referral = String(formData.get('referral') || 'none')
  let lineItems: InvoiceLineItem[] = []
  try {
    lineItems = JSON.parse(String(formData.get('lineItems') || '[]'))
  } catch {
    return { ok: false as const, error: 'Invalid line items' }
  }
  const total = lineItems.reduce((s, i) => s + Number(i.amount || 0) * Number(i.quantity || 1), 0)

  const [inv] = await db
    .insert(invoices)
    .values({
      name,
      address,
      description: JSON.stringify(lineItems),
      lineItems,
      fileNo,
      year,
      total: String(total),
      coupon,
      referral,
      date: new Date().toISOString().slice(0, 10),
      paymentStatus: 'none',
      paymentMode: 'none',
      createdBy: session.name,
    })
    .returning()

  await appendHistory({
    fileNo,
    year,
    employee: session.name,
    action: 'Invoice created',
    remark: `#${inv.id} · $${total}`,
  })

  revalidatePath('/staff/invoices')
  return { ok: true as const, id: inv.id }
}

export async function recordPaymentAction(formData: FormData) {
  const session = await getSession('staff')
  if (!session) return { ok: false as const, error: 'Unauthorized' }

  const fileNo = String(formData.get('fileNo') || '')
  const year = Number(formData.get('year') || session.taxYear)
  const invoiceId = Number(formData.get('invoiceId') || 0) || null
  const paymentReceived = String(formData.get('paymentReceived') || '')
  const totalFee = Number(formData.get('totalFee') || 0)
  const source = String(formData.get('source') || 'zelle') === 'other' ? 'other' : 'zelle'
  const remarks = String(formData.get('remarks') || '')
  const discount = String(formData.get('discount') || '0')
  const referralBonus = String(formData.get('referralBonus') || '0')

  await db.insert(payments).values({
    fileNo,
    year,
    invoiceId,
    invoiceNo: invoiceId ? String(invoiceId) : '',
    source,
    discount,
    referralBonus,
    paymentReceived,
    totalFee,
    date: new Date().toISOString().slice(0, 10),
    remarks,
  })

  if (invoiceId) {
    await db
      .update(invoices)
      .set({ paymentStatus: 'paid', paymentMode: source })
      .where(eq(invoices.id, invoiceId))
  }

  const [tf] = await db
    .select()
    .from(taxFiles)
    .where(and(eq(taxFiles.fileNo, fileNo), eq(taxFiles.year, year)))
    .limit(1)
  if (tf) {
    await db.update(clients).set({ paymentStatus: 1 }).where(eq(clients.id, tf.clientId))
    if (tf.substage === 'Payment Pending') {
      await db
        .update(taxFiles)
        .set({ stage: 'Post Process', substage: 'PDF Pending', updatedAt: new Date() })
        .where(eq(taxFiles.id, tf.id))
    }
  }

  await appendHistory({
    fileNo,
    year,
    employee: session.name,
    action: 'Payment recorded',
    remark: `${source} · ${paymentReceived}`,
  })

  revalidatePath('/staff/payments')
  return { ok: true as const }
}

export async function addRemarkAction(formData: FormData) {
  const session = await getSession('staff')
  if (!session) return { ok: false as const, error: 'Unauthorized' }
  const fileNo = String(formData.get('fileNo') || '')
  const year = Number(formData.get('year') || 0)
  const fileId = Number(formData.get('fileId') || 0)
  const remark = String(formData.get('remark') || '').trim()
  if (!remark) return { ok: false as const, error: 'Remark required' }
  await appendHistory({ fileNo, year, employee: session.name, action: 'Remark', remark })
  revalidatePath(`/staff/files/${fileId}`)
  return { ok: true as const }
}

export async function sendClientEmailAction(formData: FormData) {
  const session = await getSession('staff')
  if (!session) return { ok: false as const, error: 'Unauthorized' }
  const fileId = Number(formData.get('fileId') || 0)
  const to = String(formData.get('to') || '')
  const subject = String(formData.get('subject') || '')
  const body = String(formData.get('body') || '')
  const fileNo = String(formData.get('fileNo') || '')
  const year = Number(formData.get('year') || 0)

  await sendEmail({ to, subject, html: body })
  await appendHistory({
    fileNo,
    year,
    employee: session.name,
    action: 'Email sent',
    remark: subject,
  })
  await db.insert(mails).values({ fileNo, year, summary: subject, body, createdBy: session.name })
  revalidatePath(`/staff/files/${fileId}`)
  return { ok: true as const }
}

export async function listEmployeesAction() {
  return db.select().from(employees).orderBy(employees.firstName)
}

export async function createEmployeeAction(formData: FormData) {
  const session = await getSession('staff')
  if (!session) return { ok: false as const, error: 'Unauthorized' }
  assertAdmin(session)
  const firstName = String(formData.get('firstName') || '')
  const lastName = String(formData.get('lastName') || '')
  const login = String(formData.get('login') || '')
  const email = String(formData.get('email') || '')
  const phone = String(formData.get('phone') || '')
  const password = String(formData.get('password') || '')
  if (!firstName || !lastName || !login || !password) return { ok: false as const, error: 'Required fields missing' }
  await db.insert(employees).values({
    firstName,
    lastName,
    login,
    email,
    phone,
    passwordHash: await hashPassword(password),
    isAdmin: login.toLowerCase() === 'admin',
  })
  revalidatePath('/staff/employees')
  return { ok: true as const }
}

export async function markNotificationsReadAction() {
  const session = await getSession('staff')
  if (!session?.employeeId) return
  await db
    .update(notifications)
    .set({ status: 1 })
    .where(and(eq(notifications.targetEmpId, session.employeeId), eq(notifications.status, 0)))
  revalidatePath('/staff/notifications')
}
