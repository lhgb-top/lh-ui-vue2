import { describe, it, expect, beforeEach } from 'vitest'
import LhLoading from '../../src/components/loading'

describe('LhLoading 服务', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('服务对象带注册名与 install（install 注册 v-loading 指令）', () => {
    expect(LhLoading.name).toBe('LhLoading')
    expect(typeof (LhLoading as unknown as { install?: unknown }).install).toBe('function')
  })

  it('全屏遮罩挂到 body，close 后移除', () => {
    const handle = LhLoading.show()
    expect(document.body.querySelector('.lh-loading')).toBeTruthy()
    expect(document.body.querySelector('.lh-loading--fullscreen')).toBeTruthy()
    handle.close()
    expect(document.body.querySelector('.lh-loading')).toBeNull()
  })

  it('指定 target 时遮罩铺满容器并支持自定义文案', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const handle = LhLoading.show({ target: host, text: '拼命加载中' })
    expect(host.querySelector('.lh-loading')).toBeTruthy()
    expect(host.querySelector('.lh-loading__text')?.textContent).toBe('拼命加载中')
    handle.close()
    expect(host.querySelector('.lh-loading')).toBeNull()
  })

  it('lock 选项在关闭后恢复容器 overflow', () => {
    const host = document.createElement('div')
    host.style.overflow = 'auto'
    document.body.appendChild(host)
    const handle = LhLoading.show({ target: host, lock: true })
    expect(host.style.overflow).toBe('hidden')
    handle.close()
    expect(host.style.overflow).toBe('auto')
  })
})
