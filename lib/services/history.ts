import { db, history } from '@/db'

export async function appendHistory(opts: {
  fileNo: string
  year: number
  employee: string
  action: string
  remark?: string
}) {
  await db.insert(history).values({
    fileNo: opts.fileNo,
    year: opts.year,
    employee: opts.employee,
    action: opts.action,
    remark: opts.remark || '',
  })
}
