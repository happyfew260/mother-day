/**
 * 入口脚本（TypeScript / strict）
 * 负责：初始化花瓣系统、滚动浮现、背景色随滚动变化。
 */

import '../css/styles.css'

import { PetalSystem } from './petals'
import { ScrollColorShift, ScrollReveal } from './scroll'

const momPraises: readonly string[] = [
  '妈妈，谢谢你总在我最累的时候，给我继续前行的力量。',
  '你是世界上唯一敢说自己不完美，却把完美给了我的人。',
  '你的微笑，是我考研路上最好的充电站。',
  '每次回家，看到你准备的热饭，所有疲惫都融化了。',
  '妈妈的爱，是那种不张扬却无处不在的光。',
  '你说“累了就回来”，是我听过最安心的话。',
  '谢谢你教会我善良与坚持，你是我一辈子的榜样。',
  '岁月偷走了你的时间，却偷不走你的美丽。',
  '妈妈，你是我见过最勇敢、最温柔的人。',
  '有时候觉得世界很大很累，但一想到你，心就有了归处。',
  '不论我飞得多远，你始终是我的灯塔。',
  '我努力成长的速度，一定要超过你老去的速度。',
  '谢谢你，把最好的年华，织进了我的成长里。',
]

/**
 * 点击向下箭头后：
 * - 轮播 6 句随机赞美语（每秒 1 句）
 * - 用户若在轮播中手动滚动（wheel/touchstart），立即中断并滚到祝福区
 * - 轮播结束自动平滑滚动到祝福卡片区
 */
function initScrollDownWithPraiseWheel(selector: string): void {
  const btn = document.querySelector<HTMLButtonElement>(selector)
  const target = document.querySelector<HTMLElement>('#blessing')
  const heroInner = document.querySelector<HTMLElement>('.hero__inner')
  if (!btn || !target || !heroInner) return

  let intervalId: number | null = null
  let stopped = false
  const bubbles = new Set<HTMLDivElement>()
  let onWheel: (() => void) | null = null
  let onTouchStart: (() => void) | null = null

  const cleanup = () => {
    if (intervalId != null) {
      window.clearInterval(intervalId)
      intervalId = null
    }

    for (const bubble of bubbles) {
      bubble.remove()
    }
    bubbles.clear()

    if (onWheel) {
      window.removeEventListener('wheel', onWheel)
      onWheel = null
    }
    if (onTouchStart) {
      window.removeEventListener('touchstart', onTouchStart)
      onTouchStart = null
    }
  }

  const finish = () => {
    cleanup()
    btn.disabled = false
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const interrupt = () => {
    if (stopped) return
    stopped = true
    finish()
  }

  btn.addEventListener('click', () => {
    if (btn.disabled) return
    btn.disabled = true
    stopped = false

    // 轮播期间若用户手动滚动，立即终止
    onWheel = () => interrupt()
    onTouchStart = () => interrupt()
    window.addEventListener('wheel', onWheel, { passive: true, once: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true, once: true })

    const shuffled = shuffle([...momPraises])
    const picks = Array.from({ length: 6 }, (_, idx) => shuffled[idx % shuffled.length] ?? momPraises[0]!)
    let i = 0

    const createBubble = (text: string) => {
      const bubble = document.createElement('div')
      bubble.className = 'bubble'
      bubble.textContent = text
      bubble.style.left = `${rand(5, 85)}%`

      bubble.addEventListener('animationend', () => {
        bubbles.delete(bubble)
        bubble.remove()
      })

      bubbles.add(bubble)
      heroInner.appendChild(bubble)
    }

    createBubble(picks[0] ?? momPraises[0]!)
    i = 1

    const startedAt = performance.now()
    intervalId = window.setInterval(() => {
      if (stopped) return
      const next = picks[i] ?? momPraises[0]!
      createBubble(next)
      i++

      // 6 秒/6 句后结束
      const elapsed = performance.now() - startedAt
      if (i >= 6 || elapsed >= 6000) {
        stopped = true
        finish()
      }
    }, 1000)
  })
}

function init(): void {
  // 花瓣飘落
  const petals = new PetalSystem({
    containerSelector: '#petals',
    count: 26,
    speedRange: [26, 78],
  })
  petals.start()

  // 滚动浮现（依次）
  const reveal = new ScrollReveal({
    threshold: 0.14,
    once: true,
    staggerMs: 90,
  })
  reveal.observe()

  // 背景渐变随滚动变化（写入 --shift）
  const shift = new ScrollColorShift({ cssVarName: '--shift' })

  initScrollDownWithPraiseWheel('#btnScrollDown')

  // 页面卸载时尽量清理（防止热更新/重复绑定导致的泄漏）
  window.addEventListener(
    'beforeunload',
    () => {
      petals.stop()
      reveal.disconnect()
      shift.destroy()
    },
    { once: true },
  )
}

init()

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]!
    arr[j] = tmp!
  }
  return arr
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

