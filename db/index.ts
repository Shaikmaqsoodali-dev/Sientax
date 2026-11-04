import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString && process.env.NODE_ENV !== 'production') {
  console.warn('[db] DATABASE_URL is not set')
}

const sql = neon(connectionString || 'postgresql://localhost:5432/sientax')
export const db = drizzle(sql, { schema })

export type Database = typeof db
export * from './schema'
