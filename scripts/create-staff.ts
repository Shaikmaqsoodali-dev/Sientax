import { config } from 'dotenv'
config({ path: '.env.local' })

import { eq, or } from 'drizzle-orm'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema'
import { hashPassword } from '../lib/auth/password'

async function main() {
  const loginOrEmail = process.argv[2]
  const password = process.argv[3]
  const firstName = process.argv[4] || 'Rayhan'
  const lastName = process.argv[5] || 'Sufi'
  const isAdmin = (process.argv[6] || 'admin').toLowerCase() !== 'employee'
  if (!loginOrEmail || !password) {
    throw new Error('Usage: tsx scripts/create-staff.ts <login-or-email> <password> [first] [last] [admin|employee]')
  }

  const email = loginOrEmail.includes('@') ? loginOrEmail.toLowerCase() : loginOrEmail.toLowerCase()
  const login = loginOrEmail.toLowerCase()

  const db = drizzle(neon(process.env.DATABASE_URL!), { schema })
  const existing = await db
    .select()
    .from(schema.employees)
    .where(or(eq(schema.employees.login, login), eq(schema.employees.email, email)))
    .limit(1)

  if (existing[0]) {
    await db
      .update(schema.employees)
      .set({
        passwordHash: await hashPassword(password),
        email,
        login,
        isAdmin,
        active: true,
        firstName,
        lastName,
      })
      .where(eq(schema.employees.id, existing[0].id))
    console.log(
      JSON.stringify({
        ok: true,
        action: 'updated',
        employeeId: existing[0].id,
        login,
        email,
        isAdmin,
        loginUrl: '/staff/login',
      }),
    )
    return
  }

  const [emp] = await db
    .insert(schema.employees)
    .values({
      firstName,
      lastName,
      email,
      phone: '',
      login,
      passwordHash: await hashPassword(password),
      isAdmin,
      active: true,
    })
    .returning()

  console.log(
    JSON.stringify({
      ok: true,
      action: 'created',
      employeeId: emp.id,
      login: emp.login,
      email: emp.email,
      isAdmin: emp.isAdmin,
      loginUrl: '/staff/login',
    }),
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
