import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LhSkeleton, { LhSkeletonItem } from '../../src/components/skeleton'

describe('LhSkeleton', () => {
  it('renders placeholder rows while loading', () => {
    const wrapper = mount(LhSkeleton, { propsData: { rows: 3 } })
    expect(wrapper.classes()).toContain('lh-skeleton')
    expect(wrapper.classes()).toContain('lh-skeleton--animated')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('aria-live')).toBe('polite')
    expect(wrapper.findAll('.lh-skeleton-item--text')).toHaveLength(3)
  })

  it('renders real content when not loading', () => {
    const wrapper = mount(LhSkeleton, {
      propsData: { loading: false },
      slots: { default: '<p>真实内容</p>' },
    })
    expect(wrapper.find('.lh-skeleton').exists()).toBe(false)
    expect(wrapper.text()).toBe('真实内容')
  })

  it('prepends an avatar placeholder when requested', () => {
    const wrapper = mount(LhSkeleton, { propsData: { avatar: true, rows: 2 } })
    expect(wrapper.classes()).toContain('lh-skeleton--with-avatar')
    expect(wrapper.find('.lh-skeleton__avatar.lh-skeleton-item--circle').exists()).toBe(true)
    expect(wrapper.findAll('.lh-skeleton-item--text')).toHaveLength(2)
  })

  it('shortens the last row to mimic a paragraph', () => {
    const wrapper = mount(LhSkeleton, { propsData: { rows: 2 } })
    const rows = wrapper.findAll('.lh-skeleton-item--text')
    expect(rows.at(0)!.attributes('style')).toContain('width: 100%')
    expect(rows.at(1)!.attributes('style')).toContain('width: 60%')
  })

  it('disables animation when animated is false', () => {
    const wrapper = mount(LhSkeleton, { propsData: { animated: false } })
    expect(wrapper.classes()).not.toContain('lh-skeleton--animated')
  })
})

describe('LhSkeletonItem', () => {
  it('renders the requested variant with aria-hidden', () => {
    const wrapper = mount(LhSkeletonItem, { propsData: { variant: 'rect' } })
    expect(wrapper.classes()).toContain('lh-skeleton-item--rect')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})
