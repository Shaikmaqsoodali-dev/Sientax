'use client'

import { useEffect } from 'react'

export function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('motion-ready')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let observer: IntersectionObserver | null = null
    let mutations: MutationObserver | null = null

    if (reduced || !('IntersectionObserver' in window)) {
      document.querySelectorAll<HTMLElement>('.reveal').forEach(el => el.classList.add('is-visible'))
      root.classList.remove('motion-ready')
    } else {
      const seen = new WeakSet<Element>()
      observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
      )
      const observeReveals = () => {
        document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)').forEach(el => {
          if (seen.has(el)) return
          seen.add(el)
          observer?.observe(el)
        })
      }
      observeReveals()
      mutations = new MutationObserver(observeReveals)
      mutations.observe(document.body, { childList: true, subtree: true })
      root.classList.add('motion-live')
    }

    const header = document.querySelector<HTMLElement>('.site-header')
    const progress = document.querySelector<HTMLElement>('.scroll-progress')
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        header?.classList.toggle('is-scrolled', window.scrollY > 12)
        if (!progress) return
        const max = document.documentElement.scrollHeight - window.innerHeight
        progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
      observer?.disconnect()
      mutations?.disconnect()
      root.classList.remove('motion-ready', 'motion-live')
    }
  }, [])

  return <div className="scroll-progress" aria-hidden="true" />
}
