import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LhStatistic from '../../src/components/statistic'

describe('LhStatistic', () => {
  it('renders title and formatted value', () => {
    const wrapper = mount(LhStatistic, {
      propsData: { title: '年访问量', value: 1234567 },
    })
    expect(wrapper.find('.lh-statistic__title').text()).toBe('年访问量')
    expect(wrapper.find('.lh-statistic__value').text()).toBe('1,234,567')
  })

  it('applies precision', () => {
    const wrapper = mount(LhStatistic, {
      propsData: { value: 3.14159, precision: 2 },
    })
    expect(wrapper.find('.lh-statistic__value').text()).toBe('3.14')
  })

  it('disables grouping with empty separator', () => {
    const wrapper = mount(LhStatistic, {
      propsData: { value: 1234567, separator: '' },
    })
    expect(wrapper.find('.lh-statistic__value').text()).toBe('1234567')
  })

  it('renders prefix and suffix', () => {
    const wrapper = mount(LhStatistic, {
      propsData: { value: 88, prefix: '¥', suffix: '元' },
    })
    expect(wrapper.find('.lh-statistic__prefix').text()).toBe('¥')
    expect(wrapper.find('.lh-statistic__suffix').text()).toBe('元')
  })

  it('renders raw string for non-numeric value', () => {
    const wrapper = mount(LhStatistic, {
      propsData: { value: '不可统计' },
    })
    expect(wrapper.find('.lh-statistic__value').text()).toBe('不可统计')
  })

  it('preserves big-number strings beyond MAX_SAFE_INTEGER', () => {
    const wrapper = mount(LhStatistic, {
      propsData: { value: '9007199254740993' },
    })
    expect(wrapper.find('.lh-statistic__value').text()).toBe('9,007,199,254,740,993')
  })

  it('rounds big-number strings at fixed precision', () => {
    const wrapper = mount(LhStatistic, {
      propsData: { value: '9007199254740993.7', precision: 0 },
    })
    expect(wrapper.find('.lh-statistic__value').text()).toBe('9,007,199,254,740,994')
  })

  it('supports title and prefix slots', () => {
    const wrapper = mount(LhStatistic, {
      propsData: { value: 1 },
      slots: { title: '<em>自定义标题</em>', prefix: '<b>$</b>' },
    })
    expect(wrapper.find('.lh-statistic__title em').exists()).toBe(true)
    expect(wrapper.find('.lh-statistic__prefix b').exists()).toBe(true)
  })

  it('hides title element when no title given', () => {
    const wrapper = mount(LhStatistic, { propsData: { value: 5 } })
    expect(wrapper.find('.lh-statistic__title').exists()).toBe(false)
  })

  it('announces value changes via aria-live', () => {
    const wrapper = mount(LhStatistic, { propsData: { value: 5 } })
    expect(wrapper.find('.lh-statistic__value').attributes('aria-live')).toBe('polite')
  })

  it('applies sx props as inline styles on the root element', () => {
    const wrapper = mount(LhStatistic, { propsData: { value: 100, sx: { mt: 2, w: '50%' } } })
    const style = wrapper.attributes('style')
    expect(style).toContain('margin-top: 16px')
    expect(style).toContain('width: 50%')
  })
})
