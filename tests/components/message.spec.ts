import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import LhMessage from '../../src/components/message'

/** jsdom 无真实 CSS：transition-group 的离场依赖 rAF 帧推进，nextTick 等不到移除 */
const flushLeave = () => new Promise((r) => setTimeout(r, 150))

describe('LhMessage 服务', () => {
  beforeEach(async () => {
    // 服务为模块级单例：closeAll 清队列即可（host 容器常驻，不能清 body）；
    // 离场过渡依赖 rAF 推进，须等帧走完再开始下一用例
    LhMessage.closeAll()
    await new Promise((r) => setTimeout(r, 150))
  })

  it('服务对象带注册名与 install（registry 约定）', () => {
    expect(LhMessage.name).toBe('LhMessage')
    expect(typeof (LhMessage as unknown as { install?: unknown }).install).toBe('function')
  })

  it('openMessage 在 body 渲染消息条目并返回关闭句柄', async () => {
    const handle = LhMessage({ content: '已保存', duration: 0 })
    await nextTick()
    expect(document.body.querySelector('.lh-message__content')?.textContent).toBe('已保存')
    handle.close()
    await flushLeave()
    expect(document.body.querySelector('.lh-message__content')).toBeNull()
  })

  it('字符串入参与类型化方法等价', async () => {
    LhMessage.success('成功', { duration: 0 })
    LhMessage('纯文本')
    await nextTick()
    expect(document.body.querySelector('.lh-message__item--success')).toBeTruthy()
    expect(document.body.textContent).toContain('纯文本')
  })

  it('自动关闭计时器到点后移除条目并触发 onClose', async () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    LhMessage({ content: '稍候消失', duration: 50, onClose })
    await nextTick()
    expect(document.body.querySelector('.lh-message__content')).toBeTruthy()
    vi.advanceTimersByTime(60)
    vi.useRealTimers()
    await flushLeave()
    expect(document.body.querySelector('.lh-message__content')).toBeNull()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closeAll 清空全部消息', async () => {
    LhMessage({ content: '甲', duration: 0 })
    LhMessage({ content: '乙', duration: 0 })
    await nextTick()
    expect(document.body.querySelectorAll('.lh-message__content').length).toBe(2)
    LhMessage.closeAll()
    await flushLeave()
    expect(document.body.querySelectorAll('.lh-message__content').length).toBe(0)
  })
})
