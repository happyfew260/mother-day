/**
 * TypeScript 类型定义（严格模式）
 * 说明：为了让逻辑更健壮，所有公开类的构造参数与状态都以类型显式描述。
 */

export type Range = readonly [min: number, max: number]

export interface PetalSystemOptions {
  /** 花瓣容器选择器（例如：#petals） */
  containerSelector: string
  /** 花瓣数量 */
  count: number
  /** 下落速度范围（px/s） */
  speedRange: Range
}

export interface PetalState {
  el: HTMLDivElement
  /** x/y 为像素坐标（相对 viewport 左上角） */
  x: number
  y: number
  /** 每秒下落速度（px/s） */
  vy: number
  /** 横向摆动相位/频率 */
  swayPhase: number
  swaySpeed: number
  swayAmp: number
  /** 旋转 */
  rot: number
  rotSpeed: number
  /** 尺寸/透明度 */
  size: number
  alpha: number
}

export interface ScrollRevealOptions {
  /** 需要浮现的元素选择器（默认：[data-reveal]） */
  selector?: string
  /** IntersectionObserver 阈值 */
  threshold?: number
  /** 进入视口后是否只触发一次 */
  once?: boolean
  /** 依次出现时的延迟步进（ms） */
  staggerMs?: number
}

export interface ScrollColorShiftOptions {
  /** 写入到 body CSS 变量的名字（默认：--shift） */
  cssVarName?: string
  /** 起始/结束滚动距离（像素）；为空则用整页可滚动高度 */
  startPx?: number
  endPx?: number
}

export interface MessageBoardOptions {
  toggleButtonId: string
  resetButtonId: string
  formId: string
  inputId: string
  submitButtonId: string
  countId: string
  listId: string
  /** 最大字数（与 textarea maxlength 保持一致） */
  maxLen: number
}

