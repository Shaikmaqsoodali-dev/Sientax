import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { hashPassword, verifyPassword } from './password'

/**
 * Better Auth instance for session tables / future OAuth.
 * Dual-portal credential login (client email vs staff login id) uses
 * {@link ../auth/session.ts} JWT cookies, which verify migrated bcrypt hashes
 * against `clients` / `employees` directly.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.authUser,
      session: schema.authSession,
      account: schema.authAccount,
      verification: schema.authVerification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => hashPassword(password),
      verify: async ({ hash, password }) => {
        const result = await verifyPassword(password, hash)
        return result.ok
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.APP_URL,
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'client' },
      portal: { type: 'string', defaultValue: 'client' },
      legacyClientId: { type: 'number', required: false },
      legacyEmployeeId: { type: 'number', required: false },
      login: { type: 'string', required: false },
    },
  },
})

export type Auth = typeof auth
