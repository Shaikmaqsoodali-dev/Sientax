/**
 * Import product tables from phpMyAdmin MariaDB dump into Neon Postgres.
 * Skips all wp_* tables. Encrypts SSN fields. Preserves bcrypt hashes.
 *
 * Usage: npx tsx scripts/import-mysql-dump.ts [path-to-sql]
 */
import { createReadStream } from 'fs'
import { createInterface } from 'readline'
import path from 'path'
import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'
import * as schema from '../db/schema'
import { encryptPii } from '../lib/crypto/pii'

config({ path: '.env.local' })
config({ path: '.env' })

const PRODUCT_TABLES = new Set([
  'deduction',
  'dependent',
  'employee',
  'estimates',
  'files',
  'history',
  'interview_sheet',
  'interview_sheet_spouse',
  'invoices',
  'mails',
  'notification',
  'payments',
  'referral_users',
  'residency',
  'review',
  'spouse_deduction',
  'uploaded_files',
  'users',
])

const dumpPath = path.resolve(process.argv[2] || 'u236332762_sientax.sql')

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const db = drizzle(neon(process.env.DATABASE_URL), { schema })

function splitMysqlValues(tuple: string): string[] {
  const values: string[] = []
  let i = 0
  while (i < tuple.length) {
    while (i < tuple.length && (tuple[i] === ' ' || tuple[i] === ',')) i++
    if (i >= tuple.length) break
    if (tuple[i] === "'") {
      i++
      let out = ''
      while (i < tuple.length) {
        if (tuple[i] === '\\' && i + 1 < tuple.length) {
          const n = tuple[i + 1]
          const map: Record<string, string> = { n: '\n', r: '\r', t: '\t', '0': '\0', "'": "'", '"': '"', '\\': '\\' }
          out += map[n] ?? n
          i += 2
          continue
        }
        if (tuple[i] === "'") {
          if (tuple[i + 1] === "'") {
            out += "'"
            i += 2
            continue
          }
          i++
          break
        }
        out += tuple[i]
        i++
      }
      values.push(out)
    } else if (tuple.slice(i, i + 4).toUpperCase() === 'NULL') {
      values.push(null as unknown as string)
      i += 4
    } else {
      let out = ''
      while (i < tuple.length && tuple[i] !== ',') {
        out += tuple[i]
        i++
      }
      values.push(out.trim())
    }
  }
  return values
}

function extractTuples(insertSql: string): string[][] {
  const valuesIdx = insertSql.search(/\)\s*VALUES\s*/i)
  if (valuesIdx < 0) return []
  let body = insertSql.slice(valuesIdx)
  body = body.replace(/^\)\s*VALUES\s*/i, '')
  body = body.replace(/;\s*$/, '')
  const tuples: string[][] = []
  let depth = 0
  let start = -1
  let inStr = false
  for (let i = 0; i < body.length; i++) {
    const c = body[i]
    if (inStr) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === "'") inStr = false
      continue
    }
    if (c === "'") {
      inStr = true
      continue
    }
    if (c === '(') {
      if (depth === 0) start = i + 1
      depth++
    } else if (c === ')') {
      depth--
      if (depth === 0 && start >= 0) {
        tuples.push(splitMysqlValues(body.slice(start, i)))
        start = -1
      }
    }
  }
  return tuples
}

function parseColumns(insertSql: string): string[] {
  const m = insertSql.match(/INSERT INTO `[^`]+`\s*\(([^)]+)\)/i)
  if (!m) return []
  return m[1].split(',').map((c) => c.trim().replace(/`/g, ''))
}

function toInt(v: string | null | undefined, fallback = 0): number {
  if (v == null || v === '') return fallback
  const n = parseInt(String(v), 10)
  return Number.isFinite(n) ? n : fallback
}

function str(v: string | null | undefined, fallback = ''): string {
  return v == null ? fallback : String(v)
}

async function resetProductTables() {
  console.log('Truncating product tables…')
  await db.execute(sql`
    TRUNCATE TABLE
      documents, dependents, residencies, interview_sheet_spouses, interview_sheets,
      estimates, payments, invoices, notifications, history, mails,
      password_reset_tokens, tax_files, clients, employees, settings
    RESTART IDENTITY CASCADE
  `)
}

type Bucket = Record<string, { columns: string[]; rows: string[][] }>

async function parseDump(): Promise<Bucket> {
  console.log('Parsing', dumpPath)
  const rl = createInterface({ input: createReadStream(dumpPath, { encoding: 'utf8' }), crlfDelay: Infinity })
  const bucket: Bucket = {}
  let collecting: string | null = null
  let buf = ''
  let currentTable = ''

  for await (const line of rl) {
    if (!collecting) {
      const m = line.match(/^INSERT INTO `([^`]+)`/i)
      if (!m) continue
      if (!PRODUCT_TABLES.has(m[1])) continue
      currentTable = m[1]
      collecting = currentTable
      buf = line
      if (line.trimEnd().endsWith(';')) {
        const cols = parseColumns(buf)
        const rows = extractTuples(buf)
        if (!bucket[currentTable]) bucket[currentTable] = { columns: cols, rows: [] }
        bucket[currentTable].rows.push(...rows)
        if (!bucket[currentTable].columns.length) bucket[currentTable].columns = cols
        collecting = null
        buf = ''
      }
      continue
    }
    buf += '\n' + line
    if (line.trimEnd().endsWith(';')) {
      const cols = parseColumns(buf)
      const rows = extractTuples(buf)
      if (!bucket[currentTable]) bucket[currentTable] = { columns: cols, rows: [] }
      bucket[currentTable].rows.push(...rows)
      if (!bucket[currentTable].columns.length) bucket[currentTable].columns = cols
      collecting = null
      buf = ''
    }
  }

  for (const [t, data] of Object.entries(bucket)) {
    console.log(`  ${t}: ${data.rows.length} rows`)
  }
  return bucket
}

function rowObj(columns: string[], row: string[]): Record<string, string | null> {
  const o: Record<string, string | null> = {}
  columns.forEach((c, i) => {
    o[c] = row[i] ?? null
  })
  return o
}

async function importAll(bucket: Bucket) {
  // Employees
  const emp = bucket.employee
  if (emp) {
    for (const row of emp.rows) {
      const r = rowObj(emp.columns, row)
      const login = str(r.login)
      await db.insert(schema.employees).values({
        id: toInt(r.id),
        firstName: str(r.first_name),
        lastName: str(r.last_name),
        email: str(r.email),
        phone: str(r.phone),
        login,
        passwordHash: str(r.password),
        businessEmail: str(r.business_email),
        level: toInt(r.level),
        isAdmin: login.toLowerCase() === 'admin',
        active: true,
      })
    }
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('employees','id'), COALESCE((SELECT MAX(id) FROM employees), 1))`)
    console.log('Imported employees', emp.rows.length)
  }

  // Clients from users
  const users = bucket.users
  if (users) {
    for (const row of users.rows) {
      const r = rowObj(users.columns, row)
      const registeredBy = str(r.registered_by, 'self')
      await db.insert(schema.clients).values({
        id: toInt(r.id),
        firstName: str(r.first_name),
        middleName: str(r.middle_name),
        lastName: str(r.last_name),
        email: str(r.email),
        phone: str(r.phone),
        altPhone: str(r.alt_phone, ' '),
        passwordHash: str(r.password, 'itaxr'),
        paymentStatus: toInt(r.payment_status),
        registeredBy,
        fileNo: str(r.file_no),
        year: r.year == null ? null : toInt(r.year),
        referral: str(r.referral, '0'),
        timeZone: str(r.time_zone, 'none'),
        pref: str(r.pref, 'none'),
        role: registeredBy.toLowerCase() === 'refer' ? 'refer' : 'client',
      })
    }
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('clients','id'), COALESCE((SELECT MAX(id) FROM clients), 1))`)
    console.log('Imported clients', users.rows.length)
  }

  // Tax files
  const files = bucket.files
  if (files) {
    for (const row of files.rows) {
      const r = rowObj(files.columns, row)
      await db.insert(schema.taxFiles).values({
        id: toInt(r.file_id),
        fileNo: str(r.file_no),
        clientId: toInt(r.user_id),
        empId: toInt(r.emp_id, 1),
        year: toInt(r.year, new Date().getFullYear()),
        stage: str(r.stage, 'Pre Process'),
        substage: str(r.substage, 'Interview Pending'),
      })
    }
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('tax_files','id'), COALESCE((SELECT MAX(id) FROM tax_files), 1))`)
    console.log('Imported tax_files', files.rows.length)
  }

  // Interview
  const iv = bucket.interview_sheet
  if (iv) {
    for (const row of iv.rows) {
      const r = rowObj(iv.columns, row)
      await db.insert(schema.interviewSheets).values({
        fileNo: str(r.file_no),
        year: toInt(r.year),
        maritalStatus: str(r.marital_status),
        ssnEncrypted: encryptPii(str(r.ssn)),
        dateOfMarriage: str(r.date_of_marriage),
        dateOfBirth: str(r.date_of_birth),
        currentVisaCategory: str(r.current_visa_category),
        currentAddress: str(r.current_address),
        occupation: str(r.occupation),
        currentCity: str(r.current_city),
        currentState: str(r.current_state),
        zipcode: str(r.zipcode),
        comment: str(r.comment, ' '),
      })
    }
    console.log('Imported interview_sheets', iv.rows.length)
  }

  const ivs = bucket.interview_sheet_spouse
  if (ivs) {
    for (const row of ivs.rows) {
      const r = rowObj(ivs.columns, row)
      await db.insert(schema.interviewSheetSpouses).values({
        fileNo: str(r.file_no),
        year: toInt(r.year),
        firstName: str(r.first_name),
        middleName: str(r.middle_name),
        lastName: str(r.last_name),
        email: str(r.email),
        phone: str(r.phone),
        maritalStatus: str(r.marital_status),
        ssnEncrypted: encryptPii(str(r.ssn)),
        dateOfMarriage: str(r.date_of_marriage),
        dateOfBirth: str(r.date_of_birth),
        currentVisaCategory: str(r.current_visa_category),
        currentAddress: str(r.current_address),
        occupation: str(r.occupation),
        currentCity: str(r.current_city),
        currentState: str(r.current_state),
        zipcode: str(r.zipcode),
        comment: str(r.comment, ' '),
      })
    }
    console.log('Imported interview_sheet_spouses', ivs.rows.length)
  }

  const deps = bucket.dependent
  if (deps) {
    for (const row of deps.rows) {
      const r = rowObj(deps.columns, row)
      await db.insert(schema.dependents).values({
        id: toInt(r.id),
        fileNo: str(r.file_no),
        year: toInt(r.year),
        firstName: str(r.first_name),
        middleName: str(r.middle_name, ' '),
        lastName: str(r.last_name),
        relation: str(r.relation),
        dateOfBirth: str(r.date_of_birth),
        ssnEncrypted: encryptPii(str(r.ssn)),
      })
    }
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('dependents','id'), COALESCE((SELECT MAX(id) FROM dependents), 1))`)
    console.log('Imported dependents', deps.rows.length)
  }

  const res = bucket.residency
  if (res) {
    for (const row of res.rows) {
      const r = rowObj(res.columns, row)
      await db.insert(schema.residencies).values({
        id: toInt(r.id),
        fileNo: str(r.file_no),
        year: toInt(r.year),
        state: str(r.state),
        comment: str(r.comment, ' '),
      })
    }
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('residencies','id'), COALESCE((SELECT MAX(id) FROM residencies), 1))`)
    console.log('Imported residencies', res.rows.length)
  }

  async function importDocs(
    table: string,
    kind: 'deduction' | 'spouse_deduction' | 'review' | 'other',
  ) {
    const data = bucket[table]
    if (!data) return
    for (const row of data.rows) {
      const r = rowObj(data.columns, row)
      const source = str(r.source || r.document)
      await db.insert(schema.documents).values({
        fileNo: str(r.file_no),
        year: toInt(r.year),
        kind,
        type: str(r.type || 'Other'),
        originalName: source,
        storageKey: `legacy/${source}`,
        mimeType: 'application/octet-stream',
        sizeBytes: 0,
        uploaderRole: kind === 'review' ? 'staff' : 'client',
        remarks: str(r.remarks),
        legacyMissing: true,
      })
    }
    console.log(`Imported documents from ${table}`, data.rows.length)
  }

  await importDocs('deduction', 'deduction')
  await importDocs('spouse_deduction', 'spouse_deduction')
  await importDocs('review', 'review')

  const est = bucket.estimates
  if (est) {
    for (const row of est.rows) {
      const r = rowObj(est.columns, row)
      await db.insert(schema.estimates).values({
        id: toInt(r.id),
        fileNo: str(r.file_no),
        year: toInt(r.year),
        body: str(r.estimate),
        lineItems: [],
        remark: str(r.remark),
        createdBy: str(r.created_by),
        status: 'sent',
      })
    }
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('estimates','id'), COALESCE((SELECT MAX(id) FROM estimates), 1))`)
    console.log('Imported estimates', est.rows.length)
  }

  const inv = bucket.invoices
  if (inv) {
    for (const row of inv.rows) {
      const r = rowObj(inv.columns, row)
      let lineItems: { description: string; amount: number }[] = []
      try {
        const parsed = JSON.parse(str(r.description, '[]'))
        if (Array.isArray(parsed)) lineItems = parsed
      } catch {
        lineItems = [{ description: str(r.description), amount: Number(str(r.total, '0')) || 0 }]
      }
      await db.insert(schema.invoices).values({
        id: toInt(r.id),
        name: str(r.name, 'none'),
        address: str(r.address, 'none'),
        description: str(r.description, '[]'),
        lineItems,
        fileNo: str(r.file_no),
        total: str(r.total, '0'),
        coupon: str(r.coupon, 'none'),
        referral: str(r.referral, 'none'),
        date: str(r.date, 'none'),
        paymentStatus: str(r.payment_status, 'none'),
        paymentMode: str(r.payment_mode, 'none'),
        createdBy: str(r.created_by, 'ADMIN'),
      })
    }
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('invoices','id'), COALESCE((SELECT MAX(id) FROM invoices), 1))`)
    console.log('Imported invoices', inv.rows.length)
  }

  const pay = bucket.payments
  if (pay) {
    for (const row of pay.rows) {
      const r = rowObj(pay.columns, row)
      const sourceRaw = str(r.source, 'zelle').toLowerCase()
      await db.insert(schema.payments).values({
        id: toInt(r.id),
        fileNo: str(r.file_no),
        year: toInt(r.year),
        invoiceNo: str(r.invoice_no),
        source: sourceRaw.includes('zelle') ? 'zelle' : 'other',
        discount: str(r.discount, '0'),
        referralBonus: str(r.bonos, '0'),
        paymentReceived: str(r.payment_received),
        totalFee: toInt(r.total_fee),
        date: str(r.date),
        remarks: str(r.remarks),
      })
    }
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('payments','id'), COALESCE((SELECT MAX(id) FROM payments), 1))`)
    console.log('Imported payments', pay.rows.length)
  }

  const notif = bucket.notification
  if (notif) {
    for (const row of notif.rows) {
      const r = rowObj(notif.columns, row)
      await db.insert(schema.notifications).values({
        id: toInt(r.id),
        fileNo: str(r.file_no),
        title: str(r.title),
        description: str(r.description),
        status: toInt(r.status),
        targetEmpId: toInt(r.target),
      })
    }
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('notifications','id'), COALESCE((SELECT MAX(id) FROM notifications), 1))`)
    console.log('Imported notifications', notif.rows.length)
  }

  const hist = bucket.history
  if (hist) {
    for (const row of hist.rows) {
      const r = rowObj(hist.columns, row)
      await db.insert(schema.history).values({
        id: toInt(r.id),
        fileNo: str(r.file_no),
        year: toInt(r.year),
        employee: str(r.employee),
        action: str(r.action),
        remark: str(r.remark),
      })
    }
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('history','id'), COALESCE((SELECT MAX(id) FROM history), 1))`)
    console.log('Imported history', hist.rows.length)
  }

  const mails = bucket.mails
  if (mails) {
    for (const row of mails.rows) {
      const r = rowObj(mails.columns, row)
      await db.insert(schema.mails).values({
        id: toInt(r.id),
        fileNo: str(r.file_no),
        year: toInt(r.year),
        summary: str(r.summary),
        createdBy: str(r.created_by),
      })
    }
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('mails','id'), COALESCE((SELECT MAX(id) FROM mails), 1))`)
    console.log('Imported mails', mails.rows.length)
  }

  await db.insert(schema.settings).values([
    { key: 'commission_per_converted', value: 10 },
    { key: 'commission_fee_per_converted', value: 0.1 },
    { key: 'zelle_id', value: process.env.ZELLE_ID || '' },
  ])
}

async function main() {
  const bucket = await parseDump()
  await resetProductTables()
  await importAll(bucket)
  console.log('Import complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
