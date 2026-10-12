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

  it('日期/时间组件的导航与占位文案键在六个语言包中齐备', () => {
    setLocale('zh-CN')
    expect(t('datepicker.prevMonth')).toBe('上一月')
    expect(t('datepicker.nextMonth')).toBe('下一月')
    expect(t('datepicker.placeholder')).toBe('请选择日期')
    expect(t('timepicker.placeholder')).toBe('请选择时间')
    expect(t('image.close')).toBe('关闭图片预览')
    // 非中文包同样有这些键（不再回落硬编码中文）
    setLocale('en-US')
    expect(t('datepicker.prevMonth')).toBe('Previous month')
    expect(t('datepicker.nextMonth')).toBe('Next month')
    expect(t('datepicker.placeholder')).toBe('Select date')
    expect(t('timepicker.placeholder')).toBe('Select time')
    expect(t('image.close')).toBe('Close image preview')
    setLocale('zh-CN')
  })
})
