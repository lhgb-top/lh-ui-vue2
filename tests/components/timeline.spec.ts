import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { ComponentOptions, CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhTimeline, { LhTimelineItem } from '../../src/components/timeline'

// 2.7 defineComponent 的类型是 Vue3 风格，VTU v1 / render h 需要 Vue2 形态（运行时无差异）
const TimelineComp = LhTimeline as unknown as ComponentOptions<Vue>
const TimelineItemComp = LhTimelineItem as unknown as ComponentOptions<Vue>

// VTU v1 的 scopedSlots 不传 createElement：用宿主组件 render 传子组件
const mountTimeline = (propsData: Record<string, unknown> = {}, items = 3) => {
  // Host 需声明并透传 props：闭包捕获的 propsData 无法响应外层 setProps
  const Host = defineComponent({
    name: 'TimelineHost',
    props: { mode: { type: String, default: undefined } },
    render(this: Vue & { mode?: string }, h: CreateElement) {
      return h(
        TimelineComp,
        { props: { mode: this.mode, ...propsData } },
        Array.from({ length: items }, (_, i) =>
          h(
            TimelineItemComp,
            { props: { timestamp: `第${i + 1}天`, type: i === 0 ? 'success' : undefined } },
            `事件${i + 1}`,
          ),
        ),
      )
    },
  })
  return mount(Host as unknown as ComponentOptions<Vue>)
}

describe('LhTimeline Component', () => {
  it('renders an ordered list with li items', () => {
    const wrapper = mountTimeline()
    expect(wrapper.find('ol').exists()).toBe(true)
    expect(wrapper.findAll('li').length).toBe(3)
  })

  it('applies type and hollow class names', () => {
    const wrapper = mountTimeline()
    expect(wrapper.find('.lh-timeline__item--success').exists()).toBe(true)
    expect(wrapper.find('.lh-timeline__item--last').exists()).toBe(true)
  })

  it('renders timestamp and content', () => {
    const wrapper = mountTimeline()
    expect(wrapper.text()).toContain('第1天')
    expect(wrapper.text()).toContain('事件1')
  })

  it('applies the alternate layout classes', () => {
    const wrapper = mountTimeline({ mode: 'alternate' })
    expect(wrapper.find('.lh-timeline--alternate').exists()).toBe(true)
    expect(wrapper.find('.lh-timeline__item--right').exists()).toBe(true)
  })

  it('propagates dynamic mode changes to item sides', async () => {
    const wrapper = mountTimeline()
    expect(wrapper.find('.lh-timeline--alternate').exists()).toBe(false)

    // 红线 #6：mode 提供的是 computed ref，动态切换要传导给 item 侧向类名
    await wrapper.setProps({ mode: 'alternate' })
    expect(wrapper.find('.lh-timeline--alternate').exists()).toBe(true)
    expect(wrapper.find('.lh-timeline__item--right').exists()).toBe(true)
  })
})
