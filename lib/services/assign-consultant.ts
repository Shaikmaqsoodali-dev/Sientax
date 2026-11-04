import { and, asc, count, eq, ne } from 'drizzle-orm'
import { db, employees, taxFiles } from '@/db'

/** Auto-assign the least-loaded active consultant (non-admin). */
export async function assignDefaultConsultant(year = new Date().getFullYear()): Promise<number> {
  let pool = await db
    .select({ id: employees.id })
    .from(employees)
    .where(and(eq(employees.active, true), ne(employees.login, 'admin'), eq(employees.isAdmin, false)))
    .orderBy(asc(employees.id))

  if (!pool.length) {
    pool = await db
      .select({ id: employees.id })
      .from(employees)
      .where(and(eq(employees.active, true), ne(employees.login, 'admin')))
      .orderBy(asc(employees.id))
  }

  if (!pool.length) {
    throw new Error('No consultants available. Ask an admin to create an employee first.')
  }

  let bestId = pool[0].id
  let bestLoad = Number.POSITIVE_INFINITY
  for (const emp of pool) {
    const [row] = await db
      .select({ n: count() })
      .from(taxFiles)
      .where(and(eq(taxFiles.empId, emp.id), eq(taxFiles.year, year)))
    const load = Number(row?.n || 0)
    if (load < bestLoad) {
      bestLoad = load
      bestId = emp.id
    }
  }
  return bestId
}
