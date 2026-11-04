import type { SessionPayload } from '@/lib/auth/session'

export function isStaff(session: SessionPayload) {
  return session.portal === 'staff' && (session.role === 'admin' || session.role === 'employee')
}

export function isAdmin(session: SessionPayload) {
  return session.portal === 'staff' && session.role === 'admin'
}

export function canAccessFile(
  session: SessionPayload,
  file: { empId: number; clientId: number },
): boolean {
  if (session.portal === 'staff') {
    if (session.role === 'admin') return true
    return session.employeeId === file.empId
  }
  return session.clientId === file.clientId
}

export function assertStaff(session: SessionPayload) {
  if (!isStaff(session)) throw new Error('Forbidden')
}

export function assertAdmin(session: SessionPayload) {
  if (!isAdmin(session)) throw new Error('Forbidden')
}
