import { redirect } from 'next/navigation'

export default async function ReferralLanding({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  redirect(`/signup?ref=${encodeURIComponent(code)}`)
}
