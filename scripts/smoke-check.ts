/**
 * Offline smoke checks for pipeline helpers, PII crypto, and file-no sequence.
 * Does not require DATABASE_URL.
 */
import { nextFileNo, byCode, clientTimelineIndex } from '../lib/pipeline'
import { encryptPii, decryptPii, maskSsn, hashToken } from '../lib/crypto/pii'
import { assertSafeUpload } from '../lib/files/storage'

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg)
}

assert(nextFileNo(2026, null) === '260001', 'first 2026 file')
assert(nextFileNo(2026, 260001) === '260002', 'next 2026 file')
assert(byCode(11)?.substage === 'Payment Pending', 'payment pending code')
assert(clientTimelineIndex('Estimates Pending') === 3, 'timeline index')

const enc = encryptPii('123-45-6789')
assert(enc.startsWith('v1:'), 'encrypted prefix')
assert(decryptPii(enc) === '123-45-6789', 'roundtrip')
assert(maskSsn('123-45-6789') === '***-**-6789', 'mask')
assert(hashToken('abc').length === 64, 'sha256 hex')

let blocked = false
try {
  assertSafeUpload('evil.php', 'application/x-php', 10)
} catch {
  blocked = true
}
assert(blocked, 'php upload blocked')

assertSafeUpload('w2.pdf', 'application/pdf', 100)

console.log('smoke-check: ok')
