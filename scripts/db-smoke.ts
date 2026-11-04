import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL missing')
  const sql = neon(process.env.DATABASE_URL)
  const rows = await sql`select current_database() as db, current_user as "user"`
  console.log(JSON.stringify({ ok: true, ...rows[0] }))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
