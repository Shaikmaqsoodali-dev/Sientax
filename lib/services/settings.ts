import { eq } from 'drizzle-orm'
import { db, settings } from '@/db'

const DEFAULTS = {
  commission_per_converted: 10,
  commission_fee_per_converted: 0.1,
  zelle_id: process.env.ZELLE_ID || '',
} as const

export async function getSetting<T = unknown>(key: string, fallback: T): Promise<T> {
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1)
  if (!rows[0]) return fallback
  return rows[0].value as T
}

export async function getCommissionSettings() {
  return {
    gross: await getSetting('commission_per_converted', DEFAULTS.commission_per_converted),
    fee: await getSetting('commission_fee_per_converted', DEFAULTS.commission_fee_per_converted),
    zelleId: await getSetting('zelle_id', DEFAULTS.zelle_id),
  }
}

export async function ensureDefaultSettings() {
  for (const [key, value] of Object.entries(DEFAULTS)) {
    const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1)
    if (!existing[0]) {
      await db.insert(settings).values({ key, value })
    }
  }
}
