import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  index,
} from 'drizzle-orm/pg-core'

export const portalRoleEnum = pgEnum('portal_role', ['admin', 'employee', 'client', 'refer'])
export const documentKindEnum = pgEnum('document_kind', ['deduction', 'spouse_deduction', 'review', 'other'])
export const paymentSourceEnum = pgEnum('payment_source', ['zelle', 'other'])

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 200 }).notNull(),
  lastName: varchar('last_name', { length: 200 }).notNull(),
  email: varchar('email', { length: 200 }).notNull().default(''),
  phone: varchar('phone', { length: 200 }).notNull().default(''),
  login: varchar('login', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  businessEmail: varchar('business_email', { length: 200 }).notNull().default(''),
  level: integer('level').notNull().default(0),
  isAdmin: boolean('is_admin').notNull().default(false),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const clients = pgTable(
  'clients',
  {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 200 }).notNull(),
    middleName: varchar('middle_name', { length: 100 }).notNull().default(''),
    lastName: varchar('last_name', { length: 200 }).notNull(),
    email: varchar('email', { length: 200 }).notNull(),
    phone: varchar('phone', { length: 200 }).notNull().default(''),
    altPhone: varchar('alt_phone', { length: 200 }).notNull().default(''),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    paymentStatus: integer('payment_status').notNull().default(0),
    registeredBy: varchar('registered_by', { length: 100 }).notNull().default('self'),
    fileNo: varchar('file_no', { length: 100 }).notNull().default(''),
    year: integer('year'),
    referral: varchar('referral', { length: 100 }).notNull().default('0'),
    timeZone: varchar('time_zone', { length: 255 }).notNull().default('none'),
    pref: varchar('pref', { length: 255 }).notNull().default('none'),
    role: portalRoleEnum('role').notNull().default('client'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('clients_email_idx').on(t.email), index('clients_file_no_idx').on(t.fileNo)],
)

export const taxFiles = pgTable(
  'tax_files',
  {
    id: serial('id').primaryKey(),
    fileNo: varchar('file_no', { length: 32 }).notNull(),
    clientId: integer('client_id')
      .notNull()
      .references(() => clients.id),
    empId: integer('emp_id')
      .notNull()
      .references(() => employees.id)
      .default(1),
    year: integer('year').notNull(),
    stage: varchar('stage', { length: 100 }).notNull().default('Pre Process'),
    substage: varchar('substage', { length: 200 }).notNull().default('Interview Pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex('tax_files_file_no_year_uidx').on(t.fileNo, t.year), index('tax_files_emp_year_idx').on(t.empId, t.year)],
)

export const interviewSheets = pgTable(
  'interview_sheets',
  {
    id: serial('id').primaryKey(),
    fileNo: varchar('file_no', { length: 32 }).notNull(),
    year: integer('year').notNull(),
    maritalStatus: varchar('marital_status', { length: 200 }).notNull().default(''),
    ssnEncrypted: text('ssn_encrypted').notNull().default(''),
    dateOfMarriage: varchar('date_of_marriage', { length: 100 }).notNull().default(''),
    dateOfBirth: varchar('date_of_birth', { length: 100 }).notNull().default(''),
    currentVisaCategory: varchar('current_visa_category', { length: 100 }).notNull().default(''),
    currentAddress: varchar('current_address', { length: 255 }).notNull().default(''),
    occupation: varchar('occupation', { length: 100 }).notNull().default(''),
    currentCity: varchar('current_city', { length: 100 }).notNull().default(''),
    currentState: varchar('current_state', { length: 100 }).notNull().default(''),
    zipcode: varchar('zipcode', { length: 100 }).notNull().default(''),
    comment: varchar('comment', { length: 255 }).notNull().default(' '),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex('interview_file_year_uidx').on(t.fileNo, t.year)],
)

export const interviewSheetSpouses = pgTable(
  'interview_sheet_spouses',
  {
    id: serial('id').primaryKey(),
    fileNo: varchar('file_no', { length: 32 }).notNull(),
    year: integer('year').notNull(),
    firstName: varchar('first_name', { length: 255 }).notNull().default(''),
    middleName: varchar('middle_name', { length: 255 }).notNull().default(''),
    lastName: varchar('last_name', { length: 255 }).notNull().default(''),
    email: varchar('email', { length: 255 }).notNull().default(''),
    phone: varchar('phone', { length: 255 }).notNull().default(''),
    maritalStatus: varchar('marital_status', { length: 200 }).notNull().default(''),
    ssnEncrypted: text('ssn_encrypted').notNull().default(''),
    dateOfMarriage: varchar('date_of_marriage', { length: 100 }).notNull().default(''),
    dateOfBirth: varchar('date_of_birth', { length: 100 }).notNull().default(''),
    currentVisaCategory: varchar('current_visa_category', { length: 100 }).notNull().default(''),
    currentAddress: varchar('current_address', { length: 255 }).notNull().default(''),
    occupation: varchar('occupation', { length: 100 }).notNull().default(''),
    currentCity: varchar('current_city', { length: 100 }).notNull().default(''),
    currentState: varchar('current_state', { length: 100 }).notNull().default(''),
    zipcode: varchar('zipcode', { length: 100 }).notNull().default(''),
    comment: varchar('comment', { length: 255 }).notNull().default(' '),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex('interview_spouse_file_year_uidx').on(t.fileNo, t.year)],
)

export const dependents = pgTable('dependents', {
  id: serial('id').primaryKey(),
  fileNo: varchar('file_no', { length: 32 }).notNull(),
  year: integer('year').notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  middleName: varchar('middle_name', { length: 255 }).notNull().default(' '),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  relation: varchar('relation', { length: 200 }).notNull(),
  dateOfBirth: varchar('date_of_birth', { length: 255 }).notNull().default(''),
  ssnEncrypted: text('ssn_encrypted').notNull().default(''),
})

export const residencies = pgTable('residencies', {
  id: serial('id').primaryKey(),
  fileNo: varchar('file_no', { length: 32 }).notNull(),
  year: integer('year').notNull(),
  state: varchar('state', { length: 200 }).notNull(),
  comment: varchar('comment', { length: 255 }).notNull().default(' '),
})

export const documents = pgTable(
  'documents',
  {
    id: serial('id').primaryKey(),
    fileNo: varchar('file_no', { length: 32 }).notNull(),
    year: integer('year').notNull(),
    kind: documentKindEnum('kind').notNull().default('deduction'),
    type: varchar('type', { length: 255 }).notNull(),
    originalName: varchar('original_name', { length: 512 }).notNull().default(''),
    storageKey: varchar('storage_key', { length: 1024 }).notNull(),
    mimeType: varchar('mime_type', { length: 255 }).notNull().default('application/octet-stream'),
    sizeBytes: integer('size_bytes').notNull().default(0),
    uploaderRole: varchar('uploader_role', { length: 50 }).notNull().default('client'),
    remarks: varchar('remarks', { length: 255 }).notNull().default(''),
    legacyMissing: boolean('legacy_missing').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('documents_file_year_idx').on(t.fileNo, t.year)],
)

export const estimates = pgTable('estimates', {
  id: serial('id').primaryKey(),
  fileNo: varchar('file_no', { length: 32 }).notNull(),
  year: integer('year').notNull(),
  body: text('body').notNull().default(''),
  lineItems: jsonb('line_items').$type<EstimateLineItem[]>().notNull().default([]),
  remark: varchar('remark', { length: 255 }).notNull().default(''),
  createdBy: varchar('created_by', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('draft'), // draft | sent | accepted | rejected
  createdOn: timestamp('created_on', { withTimezone: true }).defaultNow().notNull(),
})

export type EstimateLineItem = {
  label: string
  amount: number
  kind?: 'federal' | 'state' | 'fee' | 'discount' | 'other'
}

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().default('none'),
  address: varchar('address', { length: 255 }).notNull().default('none'),
  description: text('description').notNull().default('[]'),
  lineItems: jsonb('line_items').$type<InvoiceLineItem[]>().notNull().default([]),
  fileNo: varchar('file_no', { length: 32 }).notNull().default('0'),
  year: integer('year'),
  total: varchar('total', { length: 255 }).notNull().default('0'),
  coupon: varchar('coupon', { length: 255 }).notNull().default('none'),
  referral: varchar('referral', { length: 255 }).notNull().default('none'),
  date: varchar('date', { length: 255 }).notNull().default('none'),
  paymentStatus: varchar('payment_status', { length: 100 }).notNull().default('none'),
  paymentMode: varchar('payment_mode', { length: 100 }).notNull().default('none'),
  createdBy: varchar('created_by', { length: 255 }).notNull().default('ADMIN'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type InvoiceLineItem = {
  description: string
  amount: number
  quantity?: number
}

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  fileNo: varchar('file_no', { length: 32 }).notNull(),
  year: integer('year').notNull(),
  invoiceId: integer('invoice_id').references(() => invoices.id),
  invoiceNo: varchar('invoice_no', { length: 255 }).notNull().default(''),
  source: paymentSourceEnum('source').notNull().default('zelle'),
  discount: varchar('discount', { length: 255 }).notNull().default('0'),
  referralBonus: varchar('referral_bonus', { length: 100 }).notNull().default('0'),
  paymentReceived: varchar('payment_received', { length: 100 }).notNull(),
  totalFee: integer('total_fee').notNull().default(0),
  date: varchar('date', { length: 100 }).notNull().default(''),
  remarks: varchar('remarks', { length: 255 }).notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  fileNo: varchar('file_no', { length: 32 }).notNull().default(''),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 512 }).notNull().default(''),
  status: integer('status').notNull().default(0), // 0 unread, 1 read
  targetEmpId: integer('target_emp_id'),
  targetClientId: integer('target_client_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const history = pgTable('history', {
  id: serial('id').primaryKey(),
  fileNo: varchar('file_no', { length: 32 }).notNull(),
  year: integer('year').notNull(),
  employee: varchar('employee', { length: 255 }).notNull(),
  action: varchar('action', { length: 255 }).notNull(),
  remark: text('remark').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const mails = pgTable('mails', {
  id: serial('id').primaryKey(),
  fileNo: varchar('file_no', { length: 32 }).notNull(),
  year: integer('year').notNull(),
  summary: varchar('summary', { length: 255 }).notNull(),
  body: text('body').notNull().default(''),
  createdBy: varchar('created_by', { length: 255 }).notNull(),
  createdOn: timestamp('created_on', { withTimezone: true }).defaultNow().notNull(),
})

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  portal: varchar('portal', { length: 20 }).notNull(), // client | staff
  subjectId: integer('subject_id').notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  tokenHash: varchar('token_hash', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/** Better Auth core tables (session management) */
export const authUser = pgTable('auth_user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  role: varchar('role', { length: 50 }).notNull().default('client'),
  portal: varchar('portal', { length: 20 }).notNull().default('client'),
  legacyClientId: integer('legacy_client_id'),
  legacyEmployeeId: integer('legacy_employee_id'),
  login: varchar('login', { length: 255 }),
})

export const authSession = pgTable('auth_session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => authUser.id),
  taxYear: integer('tax_year'),
})

export const authAccount = pgTable('auth_account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => authUser.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const authVerification = pgTable('auth_verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
