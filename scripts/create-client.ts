import { config } from 'dotenv'
config({ path: '.env.local' })

import { eq } from 'drizzle-orm'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema'
import { hashPassword } from '../lib/auth/password'
import { nextFileNo } from '../lib/pipeline'

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]
  const firstName = process.argv[4] || 'Rayhan'
  const lastName = process.argv[5] || 'Sufi'
  if (!email || !password) {
    throw new Error('Usage: tsx scripts/create-client.ts <email> <password> [first] [last]')
  }

  const db = drizzle(neon(process.env.DATABASE_URL!), { schema })
  const year = new Date().getFullYear()

  const existing = await db.select().from(schema.clients).where(eq(schema.clients.email, email.toLowerCase())).limit(1)
  if (existing[0]) {
    await db
      .update(schema.clients)
      .set({ passwordHash: await hashPassword(password), role: 'client' })
      .where(eq(schema.clients.id, existing[0].id))
    console.log(JSON.stringify({ ok: true, action: 'password_updated', clientId: existing[0].id, email, fileNo: existing[0].fileNo }))
    return
  }

  let employees = await db.select().from(schema.employees).limit(5)
  if (!employees.length) {
    const [emp] = await db
      .insert(schema.employees)
      .values({
        firstName: 'Tax',
        lastName: 'Consultant',
        email: 'consultant@sientax.com',
        phone: '',
        login: 'consultant',
        passwordHash: await hashPassword('ChangeMe123!'),
        isAdmin: false,
      })
      .returning()
    employees = [emp]
    // also ensure admin exists for staff login later
    await db.insert(schema.employees).values({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@sientax.com',
      phone: '',
      login: 'admin',
      passwordHash: await hashPassword('Admin@123'),
      isAdmin: true,
    })
  }

  const empId = employees.find((e) => !e.isAdmin && e.login.toLowerCase() !== 'admin')?.id || employees[0].id

  const files = await db.select({ fileNo: schema.taxFiles.fileNo }).from(schema.taxFiles)
  const max = files.reduce((m, f) => {
    const n = Number(f.fileNo)
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  const fileNo = nextFileNo(year, max || null)

  const [client] = await db
    .insert(schema.clients)
    .values({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone: '',
      passwordHash: await hashPassword(password),
      registeredBy: 'seed',
      fileNo,
      year,
      timeZone: 'ET',
      pref: 'morning',
      role: 'client',
      emailVerified: true,
    })
    .returning()

  await db.insert(schema.taxFiles).values({
    fileNo,
    clientId: client.id,
    empId,
    year,
    stage: 'Pre Process',
    substage: 'Interview Pending',
  })

  console.log(
    JSON.stringify({
      ok: true,
      action: 'created',
      clientId: client.id,
      email: client.email,
      fileNo,
      year,
      empId,
      loginUrl: '/login',
    }),
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
