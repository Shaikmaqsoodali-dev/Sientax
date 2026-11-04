import { and, count, eq, sql } from 'drizzle-orm'
import { db, taxFiles, notifications } from '@/db'
import { SUBSTAGES, type StageCode } from '@/lib/pipeline'

export async function queueCounts(opts: { empId?: number; year: number; isAdmin: boolean }) {
  const conditions = [eq(taxFiles.year, opts.year)]
  if (!opts.isAdmin && opts.empId) conditions.push(eq(taxFiles.empId, opts.empId))

  const rows = await db
    .select({ substage: taxFiles.substage, n: count() })
    .from(taxFiles)
    .where(and(...conditions))
    .groupBy(taxFiles.substage)

  const bySub = new Map(rows.map((r) => [r.substage.toLowerCase(), Number(r.n)]))
  const result: Partial<Record<StageCode, number>> = {}
  for (const s of SUBSTAGES) {
    result[s.code] = bySub.get(s.substage.toLowerCase()) || 0
  }
  return result
}

export async function unreadStaffNotifications(empId: number) {
  const rows = await db
    .select({ n: count() })
    .from(notifications)
    .where(and(eq(notifications.targetEmpId, empId), eq(notifications.status, 0)))
  return Number(rows[0]?.n || 0)
}

export async function maxFileNoForYear(year: number): Promise<number | null> {
  const result = await db.execute(sql`SELECT MAX(CAST(file_no AS INTEGER)) AS max FROM tax_files WHERE year = ${year}`)
  const max = (result.rows?.[0] as { max?: string | number } | undefined)?.max
  if (max == null) return null
  const n = Number(max)
  return Number.isFinite(n) ? n : null
}
