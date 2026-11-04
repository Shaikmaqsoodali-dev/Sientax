import bcrypt from 'bcryptjs'

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10)
}

/** Accept bcrypt hashes; also accept legacy plaintext once and return needsRehash. */
export async function verifyPassword(
  plain: string,
  stored: string,
): Promise<{ ok: boolean; needsRehash: boolean }> {
  if (!stored) return { ok: false, needsRehash: false }
  if (stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$')) {
    const ok = await bcrypt.compare(plain, stored)
    return { ok, needsRehash: false }
  }
  // Legacy plaintext from PHP
  if (plain === stored) return { ok: true, needsRehash: true }
  return { ok: false, needsRehash: false }
}
