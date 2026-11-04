import Image from 'next/image'
import Link from 'next/link'

export function ShellBrand({
  href,
  portal,
}: {
  href: string
  portal: string
}) {
  return (
    <div className="dash-brand-block">
      <Link href={href} className="dash-logo-link" aria-label="Sientax home">
        <Image
          src="/Sientax-Logo-2024-01-1.webp"
          alt="Sientax"
          width={140}
          height={36}
          className="dash-logo-img"
          priority
        />
      </Link>
      <p className="dash-portal-tag">{portal}</p>
    </div>
  )
}
