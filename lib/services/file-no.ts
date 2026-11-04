import { sql } from 'drizzle-orm'
import { db } from '@/db'
import { nextFileNo } from '@/lib/pipeline'

export async function allocateFileNo(year: number): Promise<string> {
  const result = await db.execute(sql`SELECT MAX(CAST(file_no AS INTEGER)) AS max FROM tax_files WHERE year = ${year}`)
  const row = (result as { rows?: Array<{ max?: string | number | null }> }).rows?.[0]
  const maxRaw = row?.max
  const max = maxRaw == null || maxRaw === '' ? null : Number(maxRaw)
  return nextFileNo(year, max != null && Number.isFinite(max) ? max : null)
}
