import { NextRequest, NextResponse } from 'next/server'
import { readLocalObject } from '@/lib/files/storage'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!key || key.includes('..')) return NextResponse.json({ error: 'Invalid key' }, { status: 400 })

  const staff = await getSession('staff')
  const client = await getSession('client')
  if (!staff && !client) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const buf = await readLocalObject(key)
    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${key.split('/').pop()}"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
