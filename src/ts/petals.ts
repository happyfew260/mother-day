import type { PetalState, PetalSystemOptions, Range } from './types'

/**
 * 花瓣飘落引擎：纯 DOM + requestAnimationFrame
 * - 随机尺寸/透明度/速度
 * - 无规律横向摆动（sway）
 * - 视口外自动回收并重置，避免无限增长
 */
export class PetalSystem {
  private readonly container: HTMLElement
  private readonly count: number
  private readonly speedRange: Range

  private petals: PetalState[] = []
  private rafId: number | null = null
  private lastTs = 0

  private viewportW = window.innerWidth
  private viewportH = window.innerHeight

  constructor(containerSelector: string, count: number, speedRange: Range)
  constructor(options: PetalSystemOptions)
  constructor(
    a: string | PetalSystemOptions,
    b?: number,
    c?: Range,
  ) {
    const opts: PetalSystemOptions =
      typeof a === 'string'
        ? { containerSelector: a, count: b ?? 26, speedRange: c ?? [26, 78] }
        : a

    const container = document.querySelector<HTMLElement>(opts.containerSelector)
    if (!container) {
      throw new Error(`PetalSystem: container not found: ${opts.containerSelector}`)
    }

    this.container = container
    this.count = opts.count
    this.speedRange = opts.speedRange

    this.handleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.handleResize, { passive: true })
  }

  /** 启动动画循环 */
  start(): void {
    if (this.rafId != null) return

    this.viewportW = window.innerWidth
    this.viewportH = window.innerHeight

    this.clear()
    this.createPetals()
    this.lastTs = performance.now()
    this.rafId = requestAnimationFrame((ts) => this.tick(ts))
  }

  /** 停止动画循环并清理 */
  stop(): void {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    window.removeEventListener('resize', this.handleResize)
    this.clear()
  }

  private handleResize(): void {
    this.viewportW = window.innerWidth
    this.viewportH = window.innerHeight
  }

  private clear(): void {
    for (const p of this.petals) p.el.remove()
    this.petals = []
  }

  private createPetals(): void {
    for (let i = 0; i < this.count; i++) {
      const p = this.spawnPetal({ initial: true })
      this.petals.push(p)
      this.container.appendChild(p.el)
    }
  }

  private spawnPetal(params?: { initial?: boolean }): PetalState {
    const el = document.createElement('div')
    el.className = Math.random() < 0.5 ? 'petal' : 'petal petal--alt'

    const size = rand(12, 22)
    const alpha = rand(0.38, 0.78)
    const vy = rand(this.speedRange[0], this.speedRange[1])

    const x = rand(-20, this.viewportW + 20)
    const y = params?.initial ? rand(-this.viewportH, 0) : rand(-120, -30)

    const swayPhase = rand(0, Math.PI * 2)
    const swaySpeed = rand(0.6, 1.4)
    const swayAmp = rand(10, 38)

    const rot = rand(-30, 30)
    const rotSpeed = rand(-28, 28)

    el.style.setProperty('--p-size', `${size}px`)
    el.style.setProperty('--p-a', `${alpha}`)

    return { el, x, y, vy, swayPhase, swaySpeed, swayAmp, rot, rotSpeed, size, alpha }
  }

  private resetPetal(p: PetalState): void {
    const np = this.spawnPetal()

    p.x = np.x
    p.y = np.y
    p.vy = np.vy
    p.swayPhase = np.swayPhase
    p.swaySpeed = np.swaySpeed
    p.swayAmp = np.swayAmp
    p.rot = np.rot
    p.rotSpeed = np.rotSpeed
    p.size = np.size
    p.alpha = np.alpha

    p.el.className = np.el.className
    p.el.style.setProperty('--p-size', `${p.size}px`)
    p.el.style.setProperty('--p-a', `${p.alpha}`)
  }

  private tick(ts: number): void {
    const dt = Math.min(0.033, Math.max(0.001, (ts - this.lastTs) / 1000))
    this.lastTs = ts

    for (const p of this.petals) {
      p.y += p.vy * dt
      p.swayPhase += p.swaySpeed * dt
      p.rot += p.rotSpeed * dt

      const swayX = Math.sin(p.swayPhase) * p.swayAmp
      const x = p.x + swayX

      p.el.style.setProperty('--p-x', `${x}px`)
      p.el.style.setProperty('--p-y', `${p.y}px`)
      p.el.style.setProperty('--p-r', `${p.rot}deg`)

      if (p.y > this.viewportH + 120) {
        this.resetPetal(p)
      }
    }

    this.rafId = requestAnimationFrame((t) => this.tick(t))
  }
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

