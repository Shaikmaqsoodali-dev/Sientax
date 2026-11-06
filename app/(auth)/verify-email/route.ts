import { NextRequest, NextResponse } from 'next/server'
import { completeEmailVerification } from '@/lib/services/verify-email'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const result = await completeEmailVerification(token)

  if (!result.ok) {
    const url = request.nextUrl.clone()
    url.pathname = '/verify-email/failed'
    url.search = ''
    url.searchParams.set('error', result.error)
    return NextResponse.redirect(url)
  }

  const dest = new URL(result.redirectTo, request.nextUrl.origin)
  return NextResponse.redirect(dest)
}
