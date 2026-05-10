/**
 * 入口脚本（TypeScript / strict）
 * 负责：初始化花瓣系统、滚动浮现、背景色随滚动变化、留言板、以及祝福语互动。
 */

import '../css/styles.css'

import { PetalSystem } from './petals'
import { ScrollColorShift, ScrollReveal } from './scroll'
import { MessageBoard } from './messageBoard'

const blessings: readonly string[] = [
  '妈妈，谢谢你把爱藏进每一次细心的叮咛里。愿你的每一天都被温柔以待，笑容像春日一样明亮。',
  '你把平凡的日子过成了闪光的故事，把我托举到更远的地方。愿岁月对你轻一点，再轻一点。',
  '愿你不止是“妈妈”，也永远是你自己：被看见、被珍惜、被偏爱，永远拥有自己的浪漫。',
  '谢谢你一次次把疲惫藏起来，把温柔留给我们。今天换我说：妈妈，我爱你。',
  '愿你眼角的笑意常在，愿你心里的花一直开。母亲节快乐，最好的妈妈。',
]

function initBlessingSwitcher(): void {
  const blessingEl = document.querySelector<HTMLElement>('#blessingText')
  const nextBtn = document.querySelector<HTMLButtonElement>('#btnNextBlessing')
  if (!blessingEl || !nextBtn) return

  let idx = 0

  const apply = () => {
    idx = (idx + 1) % blessings.length
    // noUncheckedIndexedAccess：索引访问可能得到 undefined，这里显式兜底
    const next = blessings[idx] ?? blessings[0]!
    blessingEl.textContent = next
    blessingEl.animate(
      [
        { opacity: 0, transform: 'translate3d(0, 6px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ],
      { duration: 520, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
    )
  }

  const onActivate = () => apply()
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      apply()
    }
  }

  blessingEl.addEventListener('click', onActivate)
  blessingEl.addEventListener('keydown', onKey)
  nextBtn.addEventListener('click', onActivate)
}

function initScrollToMessages(): void {
  const btn = document.querySelector<HTMLButtonElement>('#btnScrollToMsg')
  const target = document.querySelector<HTMLElement>('#messages')
  if (!btn || !target) return

  btn.addEventListener('click', () => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

  // 留言板
  const board = new MessageBoard({
    toggleButtonId: 'btnToggleComposer',
    resetButtonId: 'btnResetMessages',
    formId: 'messageForm',
    inputId: 'messageInput',
    submitButtonId: 'btnSubmitMessage',
    countId: 'messageCount',
    listId: 'messageList',
    maxLen: 140,
  })

  initBlessingSwitcher()
  initScrollToMessages()

  // 页面卸载时尽量清理（防止热更新/重复绑定导致的泄漏）
  window.addEventListener(
    'beforeunload',
    () => {
      petals.stop()
      reveal.disconnect()
      shift.destroy()
      board.destroy()
    },
    { once: true },
  )
}

init()

