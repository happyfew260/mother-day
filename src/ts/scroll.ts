import type { ScrollColorShiftOptions, ScrollRevealOptions } from './types'

/**
 * 滚动浮现：IntersectionObserver
 * - 自动为匹配元素加上 `is-visible`
 * - 支持 stagger（依次出现）
 */
export class ScrollReveal {
  private readonly selector: string
  private readonly once: boolean
  private readonly staggerMs: number
  private observer: IntersectionObserver | null = null

  constructor(options: ScrollRevealOptions = {}) {
    this.selector = options.selector ?? '[data-reveal]'
    this.once = options.once ?? true
    this.staggerMs = options.staggerMs ?? 85

    const threshold = options.threshold ?? 0.12
    this.observer = new IntersectionObserver(
      (entries) => this.onIntersect(entries),
      { threshold },
    )
  }

  observe(): void {
    const els = Array.from(document.querySelectorAll<HTMLElement>(this.selector))
    els.forEach((el) => this.observer?.observe(el))
  }

  disconnect(): void {
    this.observer?.disconnect()
    this.observer = null
  }

  private onIntersect(entries: IntersectionObserverEntry[]): void {
    let order = 0
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const el = entry.target as HTMLElement

      const delay = order * this.staggerMs
      order++
      window.setTimeout(() => {
        el.classList.add('is-visible')
      }, delay)

      if (this.once) this.observer?.unobserve(el)
    }
  }
}

/**
 * 滚动渐变：监听 scroll，将进度写入 CSS 变量（默认 `--shift`）
 * - 通过 `requestAnimationFrame` 合并频繁滚动事件
 * - 进度范围固定在 0..1
 */
export class ScrollColorShift {
  private readonly cssVarName: string
  private readonly startPx: number | undefined
  private readonly endPx: number | undefined

  private ticking = false
  private onScrollBound: () => void

  constructor(options: ScrollColorShiftOptions = {}) {
    this.cssVarName = options.cssVarName ?? '--shift'
    this.startPx = options.startPx
    this.endPx = options.endPx

    this.onScrollBound = () => this.onScroll()
    window.addEventListener('scroll', this.onScrollBound, { passive: true })
    this.writeProgress()
  }

  destroy(): void {
    window.removeEventListener('scroll', this.onScrollBound)
  }

  private onScroll(): void {
    if (this.ticking) return
    this.ticking = true
    requestAnimationFrame(() => {
      this.writeProgress()
      this.ticking = false
    })
  }

  private writeProgress(): void {
    const start = this.startPx ?? 0
    const maxScroll =
      this.endPx ??
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const y = window.scrollY
    const t = clamp01((y - start) / Math.max(1, maxScroll - start))

    document.body.style.setProperty(this.cssVarName, `${t}`)
  }
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

