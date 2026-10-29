'use client'

import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

// Union of anchor + button attributes so the component can render either element.
type NativeProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'href'>

export interface MovingBorderButtonProps extends NativeProps {
  /** Corner radius of the button, e.g. "1.75rem". */
  borderRadius?: string
  /** Colour of the light that travels around the border. */
  glow?: string
  /** Seconds for one full trip around the border. */
  speed?: number
  /** Renders a client-side <Link> instead of a <button>. */
  href?: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/**
 * Aceternity-style "moving border" button, implemented with a masked
 * conic-gradient ring instead of framer-motion — keeps the site's
 * CSS-only motion stack (and respects prefers-reduced-motion globally).
 */
export function Button({
  borderRadius = '1.75rem',
  glow,
  speed,
  href,
  className,
  style,
  children,
  ...rest
}: MovingBorderButtonProps) {
  const inlineStyle = {
    ...style,
    borderRadius,
    ...(glow ? { '--mb-glow': glow } : null),
    ...(speed ? { '--mb-speed': `${speed}s` } : null),
  } as CSSProperties

  const cls = cn('moving-border-btn', className)
  const inner = <span className="moving-border-label">{children}</span>

  if (href) {
    return (
      <Link href={href} className={cls} style={inlineStyle} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </Link>
    )
  }

  return (
    <button className={cls} style={inlineStyle} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  )
}
