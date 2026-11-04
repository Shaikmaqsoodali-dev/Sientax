import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'

const ALGO = 'aes-256-gcm'

function getKey(): Buffer {
  const raw = process.env.FIELD_ENCRYPTION_KEY
  if (!raw) {
    // Dev fallback — never use in production with real SSNs
    return createHash('sha256').update('sientax-dev-field-key').digest()
  }
  if (/^[0-9a-fA-F]{64}$/.test(raw)) return Buffer.from(raw, 'hex')
  try {
    const b64 = Buffer.from(raw, 'base64')
    if (b64.length === 32) return b64
  } catch {
    /* fall through */
  }
  return createHash('sha256').update(raw).digest()
}

/** Encrypt sensitive PII. Empty input returns empty string. */
export function encryptPii(plaintext: string): string {
  if (!plaintext || !plaintext.trim()) return ''
  const key = getKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGO, key, iv)
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `v1:${iv.toString('base64url')}:${tag.toString('base64url')}:${enc.toString('base64url')}`
}

export function decryptPii(ciphertext: string): string {
  if (!ciphertext) return ''
  if (!ciphertext.startsWith('v1:')) {
    // Legacy plaintext from import before encryption — do not log
    return ciphertext
  }
  const [, ivB64, tagB64, dataB64] = ciphertext.split(':')
  const key = getKey()
  const decipher = createDecipheriv(ALGO, key, Buffer.from(ivB64, 'base64url'))
  decipher.setAuthTag(Buffer.from(tagB64, 'base64url'))
  const dec = Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64url')), decipher.final()])
  return dec.toString('utf8')
}

export function maskSsn(ssn: string): string {
  const digits = ssn.replace(/\D/g, '')
  if (digits.length < 4) return '***'
  return `***-**-${digits.slice(-4)}`
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
