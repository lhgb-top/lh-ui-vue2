import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LhAnchor from '../../src/components/anchor'

const items = [
  { id: 'a', title: '甲' },
  { id: 'b', title: '乙', children: [{ id: 'b-1', title: '乙一' }] },
]

describe('LhAnchor Component', () => {
  it('renders a labelled nav with links', () => {
    const wrapper = mount(LhAnchor, { propsData: { items } })
    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.attributes('aria-label')).toBe('锚点导航')
    expect(wrapper.findAll('.lh-anchor__link').length).toBe(3)
  })

  it('marks the first anchor active initially', () => {
    const wrapper = mount(LhAnchor, { propsData: { items } })
    expect(wrapper.find('.lh-anchor__link--active').text()).toBe('甲')
  })

  it('applies level classes for nested anchors', () => {
    const wrapper = mount(LhAnchor, { propsData: { items } })
    expect(wrapper.find('.lh-anchor__link--level-1').text()).toBe('乙一')
  })

  it('applies horizontal direction', () => {
    const wrapper = mount(LhAnchor, { propsData: { items, direction: 'horizontal' } })
    expect(wrapper.classes()).toContain('lh-anchor--horizontal')
  })

  it('clicks a link to activate and emit change', async () => {
    // scrollToAnchor 需要 #a/#b 真实存在于文档，且 jsdom 无 scrollIntoView
    const stub = vi.fn()
    HTMLElement.prototype.scrollIntoView = stub
    const a = document.createElement('div')
    a.id = 'a'
    const b = document.createElement('div')
    b.id = 'b'
    document.body.append(a, b)

    const wrapper = mount(LhAnchor, { propsData: { items } })
    await wrapper.findAll('.lh-anchor__link').at(1)!.trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual(['b'])
    expect(wrapper.find('.lh-anchor__link--active').text()).toBe('乙')
    expect(stub).toHaveBeenCalled()

    a.remove()
    b.remove()
  })
})
