import { mkdir, writeFile, readFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const BLOCKED_EXT = new Set(['.php', '.phtml', '.exe', '.sh', '.bat', '.cmd', '.js', '.mjs', '.cjs', '.html', '.htm'])

const MAX_BYTES = 25 * 1024 * 1024

function r2Configured() {
  return Boolean(process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET)
}

function s3(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
}

export function assertSafeUpload(filename: string, mimeType: string, size: number) {
  const ext = path.extname(filename).toLowerCase()
  if (BLOCKED_EXT.has(ext)) throw new Error('Executable or script uploads are not allowed')
  if (!ALLOWED_MIME.has(mimeType) && mimeType !== 'application/octet-stream') {
    // allow octet-stream only for pdf-looking names
    if (!(ext === '.pdf' && mimeType === 'application/octet-stream')) {
      throw new Error(`File type not allowed: ${mimeType}`)
    }
  }
  if (size > MAX_BYTES) throw new Error('File exceeds 25MB limit')
}

export async function putObject(opts: {
  fileNo: string
  year: number
  originalName: string
  mimeType: string
  body: Buffer
}): Promise<{ storageKey: string; sizeBytes: number }> {
  assertSafeUpload(opts.originalName, opts.mimeType, opts.body.length)
  const safeName = opts.originalName.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storageKey = `files/${opts.year}/${opts.fileNo}/${randomUUID()}-${safeName}`

  if (r2Configured()) {
    await s3().send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: storageKey,
        Body: opts.body,
        ContentType: opts.mimeType,
      }),
    )
  } else {
    const root = path.join(/*turbopackIgnore: true*/ process.cwd(), process.env.UPLOAD_DIR || '.uploads')
    const dir = path.join(/*turbopackIgnore: true*/ root, path.dirname(storageKey))
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(/*turbopackIgnore: true*/ root, storageKey), opts.body)
  }

  return { storageKey, sizeBytes: opts.body.length }
}

export async function getDownloadUrl(storageKey: string, expiresIn = 300): Promise<string> {
  if (storageKey.startsWith('legacy/')) {
    throw new Error('Legacy document binary is not available yet — sync api/uploads/')
  }
  if (r2Configured()) {
    return getSignedUrl(
      s3(),
      new GetObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: storageKey }),
      { expiresIn },
    )
  }
  // Local fallback: API route streams the file
  return `/api/documents/local?key=${encodeURIComponent(storageKey)}`
}

export async function readLocalObject(storageKey: string): Promise<Buffer> {
  const root = path.join(/*turbopackIgnore: true*/ process.cwd(), process.env.UPLOAD_DIR || '.uploads')
  return readFile(path.join(/*turbopackIgnore: true*/ root, storageKey))
}
