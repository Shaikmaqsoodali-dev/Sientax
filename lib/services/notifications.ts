import { db, notifications } from '@/db'

export async function notifyEmployee(opts: {
  empId: number
  fileNo: string
  title: string
  description?: string
}) {
  await db.insert(notifications).values({
    targetEmpId: opts.empId,
    fileNo: opts.fileNo,
    title: opts.title,
    description: opts.description || '',
    status: 0,
  })
}

export async function notifyClient(opts: {
  clientId: number
  fileNo: string
  title: string
  description?: string
}) {
  await db.insert(notifications).values({
    targetClientId: opts.clientId,
    fileNo: opts.fileNo,
    title: opts.title,
    description: opts.description || '',
    status: 0,
  })
}
