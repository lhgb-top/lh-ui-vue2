import { describe, it, expect, beforeEach, vi } from 'vitest'
import LhLoading from '../../src/components/loading'

describe('LhLoading 服务', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('服务对象带注册名与 install（install 注册 v-loading 指令）', () => {
    expect(LhLoading.name).toBe('LhLoading')
    expect(typeof (LhLoading as unknown as { install?: unknown }).install).toBe('function')
  })

  it('全屏遮罩挂到 body，close 先播退场动画再移除', async () => {
    vi.useFakeTimers()
    try {
      const handle = LhLoading.show()
      expect(document.body.querySelector('.lh-loading')).toBeTruthy()
      expect(document.body.querySelector('.lh-loading--fullscreen')).toBeTruthy()
      handle.close()
      // closeLoading 先挂 --leaving 类，退场动画播完（200ms）再卸载
      expect(document.body.querySelector('.lh-loading--leaving')).toBeTruthy()
      vi.advanceTimersByTime(220)
      expect(document.body.querySelector('.lh-loading')).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('指定 target 时遮罩铺满容器并支持自定义文案', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const handle = LhLoading.show({ target: host, text: '拼命加载中' })
    expect(host.querySelector('.lh-loading')).toBeTruthy()
    expect(host.querySelector('.lh-loading__text')?.textContent).toBe('拼命加载中')
    vi.useFakeTimers()
    try {
      handle.close()
      vi.advanceTimersByTime(220)
      expect(host.querySelector('.lh-loading')).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('lock 选项在关闭后恢复容器 overflow', () => {
    const host = document.createElement('div')
    host.style.overflow = 'auto'
    document.body.appendChild(host)
    const handle = LhLoading.show({ target: host, lock: true })
    expect(host.style.overflow).toBe('hidden')
    vi.useFakeTimers()
    try {
      handle.close()
      vi.advanceTimersByTime(220)
      expect(host.style.overflow).toBe('auto')
    } finally {
      vi.useRealTimers()
    }
  })
})
