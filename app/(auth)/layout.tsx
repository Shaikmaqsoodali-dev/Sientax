import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import '../dashboard.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
