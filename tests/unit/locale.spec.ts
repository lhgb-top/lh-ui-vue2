import { describe, expect, it } from 'vitest'
import { computed } from 'vue'
import { enUS, setLocale, t, zhCN } from '../../src/locale'

describe('locale adapter（share emitter → ref）', () => {
  it('t() 透传 share 单例并支持兜底', () => {
    setLocale('zh-CN')
    expect(t('input.placeholder')).toBe('请输入')
    expect(t('not.a.key', '兜底')).toBe('兜底')
  })

  it('语言切换触发重算：computed 消费 t() 能响应 emitter bump', () => {
    setLocale('zh-CN')
    const text = computed(() => t('input.placeholder'))
    expect(text.value).toBe('请输入')
    setLocale('en-US')
    expect(text.value).toBe('Please input')
    setLocale('zh-CN')
    expect(text.value).toBe('请输入')
  })

  it('解构使用不丢失语义（t 内部读 ref，与实例无关）', () => {
    const tt = t
    expect(tt('input.placeholder')).toBe('请输入')
  })

  it('转发语言包', () => {
    expect(Object.keys(zhCN).length).toBeGreaterThan(0)
    expect(Object.keys(enUS).length).toBeGreaterThan(0)
  })
})
