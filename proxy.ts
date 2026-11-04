import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const CLIENT_COOKIE = 'sientax_client_session'
const STAFF_COOKIE = 'sientax_staff_session'

function secretKey() {
  const s = process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || 'dev-sientax-secret-change-me'
  return new TextEncoder().encode(s)
}

async function hasValid(token: string | undefined) {
  if (!token) return false
  try {
    await jwtVerify(token, secretKey())
    return true
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/app')) {
    const ok = await hasValid(request.cookies.get(CLIENT_COOKIE)?.value)
    if (!ok) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/staff') && !pathname.startsWith('/staff/login')) {
    const ok = await hasValid(request.cookies.get(STAFF_COOKIE)?.value)
    if (!ok) {
      const url = request.nextUrl.clone()
      url.pathname = '/staff/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/staff/:path*'],
}
