import type { MessageBoardOptions } from './types'

/**
 * 留言功能（纯净版）：输入框始终可见；提交后生成引文展示，支持单条删除与一键重置
 * - 默认不会持久化到 localStorage（保持“纪念页”轻量与私密）
 */
export class MessageBoard {
  private readonly opts: MessageBoardOptions

  private readonly btnReset: HTMLButtonElement
  private readonly form: HTMLFormElement
  private readonly input: HTMLTextAreaElement
  private readonly countEl: HTMLElement
  private readonly list: HTMLElement

  constructor(opts: MessageBoardOptions) {
    this.opts = opts

    this.btnReset = mustGet<HTMLButtonElement>(`#${opts.resetButtonId}`)
    this.form = mustGet<HTMLFormElement>(`#${opts.formId}`)
    this.input = mustGet<HTMLTextAreaElement>(`#${opts.inputId}`)
    this.countEl = mustGet<HTMLElement>(`#${opts.countId}`)
    this.list = mustGet<HTMLElement>(`#${opts.listId}`)

    this.onReset = this.onReset.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onInput = this.onInput.bind(this)

    this.btnReset.addEventListener('click', this.onReset)
    this.form.addEventListener('submit', this.onSubmit)
    this.input.addEventListener('input', this.onInput)

    this.updateCount()
  }

  destroy(): void {
    this.btnReset.removeEventListener('click', this.onReset)
    this.form.removeEventListener('submit', this.onSubmit)
    this.input.removeEventListener('input', this.onInput)
  }

  private onReset(): void {
    this.list.innerHTML = ''
    this.input.value = ''
    this.updateCount()
  }

  private onInput(): void {
    this.updateCount()
  }

  private onSubmit(e: SubmitEvent): void {
    e.preventDefault()
    const raw = this.input.value
    const text = normalizeText(raw)

    if (text.length === 0) {
      this.input.focus()
      this.flashInvalid()
      return
    }

    this.addQuote(text)
    this.input.value = ''
    this.updateCount()
  }

  private updateCount(): void {
    const len = this.input.value.length
    this.countEl.textContent = `${len}/${this.opts.maxLen}`
  }

  private flashInvalid(): void {
    const el = this.input
    el.animate(
      [
        { transform: 'translate3d(0, 0, 0)' },
        { transform: 'translate3d(-4px, 0, 0)' },
        { transform: 'translate3d(4px, 0, 0)' },
        { transform: 'translate3d(0, 0, 0)' },
      ],
      { duration: 220, iterations: 1 },
    )
  }

  private addQuote(text: string): void {
    const wrap = document.createElement('article')
    wrap.className = 'quote'

    const p = document.createElement('p')
    p.className = 'quote__text'
    p.textContent = text

    const meta = document.createElement('div')
    meta.className = 'quote__meta'

    const time = document.createElement('span')
    time.textContent = formatNow()

    const close = document.createElement('button')
    close.className = 'quote__close'
    close.type = 'button'
    close.setAttribute('aria-label', '删除这条留言')
    close.textContent = '×'

    close.addEventListener('click', () => {
      wrap.remove()
    })

    meta.append(time, close)
    wrap.append(p, meta)

    this.list.prepend(wrap)
  }
}

function mustGet<T extends Element>(selector: string): T {
  const el = document.querySelector(selector)
  if (!el) throw new Error(`MessageBoard: element not found: ${selector}`)
  return el as T
}

function normalizeText(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

function formatNow(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`
}

