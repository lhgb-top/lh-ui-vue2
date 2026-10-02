import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import LhNotification from '../../src/components/notification'

/** jsdom 无真实 CSS：transition-group 的离场依赖 rAF 帧推进，nextTick 等不到移除 */
const flushLeave = () => new Promise((r) => setTimeout(r, 150))

describe('LhNotification 服务', () => {
  beforeEach(async () => {
    // 离场过渡依赖 rAF 推进，清场后须等帧走完再开始下一用例
    LhNotification.closeAll()
    await new Promise((r) => setTimeout(r, 150))
  })

  it('服务对象带注册名与 install（registry 约定）', () => {
    expect(LhNotification.name).toBe('LhNotification')
    expect(typeof (LhNotification as unknown as { install?: unknown }).install).toBe('function')
  })

  it('openNotification 渲染标题/正文与关闭按钮，句柄可关闭', async () => {
    const handle = LhNotification({
      title: '通知标题',
      content: '通知正文',
      duration: 0,
    })
    await nextTick()
    expect(document.body.querySelector('.lh-notification__title')?.textContent?.trim()).toBe('通知标题')
    expect(document.body.querySelector('.lh-notification__content')?.textContent?.trim()).toBe('通知正文')
    handle.close()
    await flushLeave()
    expect(document.body.querySelector('.lh-notification__title')).toBeNull()
  })

  it('按 position 分区渲染并携带区域类名', async () => {
    LhNotification({ title: '右上', duration: 0 })
    LhNotification({ title: '左下', position: 'bottom-left', duration: 0 })
    await nextTick()
    expect(document.body.querySelector('.lh-notification--top-right')).toBeTruthy()
    expect(document.body.querySelector('.lh-notification--bottom-left')).toBeTruthy()
  })

  it('closeAll 清空全部通知', async () => {
    LhNotification({ title: '甲', duration: 0 })
    LhNotification({ title: '乙', duration: 0 })
    await nextTick()
    expect(document.body.querySelectorAll('.lh-notification__title').length).toBe(2)
    LhNotification.closeAll()
    await flushLeave()
    expect(document.body.querySelectorAll('.lh-notification__title').length).toBe(0)
  })
})
