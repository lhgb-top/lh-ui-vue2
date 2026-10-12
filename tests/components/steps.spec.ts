import { describe, it, expect } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { ComponentOptions, CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhSteps, { LhStep } from '../../src/components/steps'

const StepsComp = LhSteps as unknown as ComponentOptions<Vue>
const StepComp = LhStep as unknown as ComponentOptions<Vue>

type StepsEmit = (event: string, ...args: unknown[]) => void

function mountSteps(extraProps: Record<string, unknown> = {}) {
  // 宿主转发 update:current / change，供 wrapper.emitted 断言
  const Host = defineComponent({
    name: 'StepsHost',
    render(this: Vue & { $emit: StepsEmit }, h: CreateElement) {
      return h(
        StepsComp,
        {
          props: extraProps,
          on: {
            'update:current': (v: number) => this.$emit('update:current', v),
            change: (v: number) => this.$emit('change', v),
          },
        },
        [
          h(StepComp, { props: { title: '第一步', description: '准备' } }),
          h(StepComp, { props: { title: '第二步' } }),
          h(StepComp, { props: { title: '第三步' } }),
        ],
      )
    },
  })
  return mount(Host as unknown as ComponentOptions<Vue>)
}

describe('LhSteps', () => {
  it('renders an ordered list of steps', () => {
    const wrapper = mountSteps()
    expect(wrapper.find('ol.lh-steps').exists()).toBe(true)
    expect(wrapper.findAll('.lh-steps__item')).toHaveLength(3)
    wrapper.destroy()
  })

  it('derives wait/process/finish statuses and marks the current step', () => {
    const wrapper = mountSteps({ current: 1 })
    const items = wrapper.findAll('.lh-steps__item')
    expect(items.at(0)!.classes()).toContain('lh-steps__item--finish')
    expect(items.at(1)!.classes()).toContain('lh-steps__item--process')
    expect(items.at(1)!.attributes('aria-current')).toBe('step')
    expect(items.at(2)!.classes()).toContain('lh-steps__item--wait')
    expect(items.at(2)!.attributes('aria-current')).toBeUndefined()
    wrapper.destroy()
  })

  it('renders titles and optional descriptions', () => {
    const wrapper = mountSteps({ current: 0 })
    const titles = wrapper.findAll('.lh-steps__title')
    // WrapperArray 无 map：按索引取文本
    expect([...Array(titles.length)].map((_, i) => titles.at(i)!.text())).toEqual([
      '第一步',
      '第二步',
      '第三步',
    ])
    expect(wrapper.findAll('.lh-steps__description')).toHaveLength(1)
    wrapper.destroy()
  })

  it('renders heads as buttons only for clickable non-wait steps', async () => {
    const wrapper = mountSteps({ current: 1, clickable: true })
    const items = wrapper.findAll('.lh-steps__item')
    expect(items.at(0)!.find('button.lh-steps__head').exists()).toBe(true)
    expect(items.at(1)!.find('button.lh-steps__head').exists()).toBe(true)
    // 等待中的步骤不可点击
    expect(items.at(2)!.find('button.lh-steps__head').exists()).toBe(false)

    const finishBtn = items.at(0)!.find('button.lh-steps__head')
    expect(finishBtn.attributes('aria-label')).toBe('已完成')
    const processBtn = items.at(1)!.find('button.lh-steps__head')
    expect(processBtn.attributes('aria-label')).toBe('第 2 步')

    await finishBtn.trigger('click')
    expect(wrapper.emitted('update:current')).toEqual([[0]])
    expect(wrapper.emitted('change')).toEqual([[0]])
    wrapper.destroy()
  })

  it('does not emit when clicking the current step', async () => {
    const wrapper = mountSteps({ current: 0, clickable: true })
    await wrapper.findAll('.lh-steps__item').at(0)!.find('button.lh-steps__head').trigger('click')
    expect(wrapper.emitted('change')).toBeFalsy()
    wrapper.destroy()
  })

  it('keeps static heads when clickable is off', () => {
    const wrapper = mountSteps({ current: 1 })
    expect(wrapper.findAll('button.lh-steps__head')).toHaveLength(0)
    wrapper.destroy()
  })

  it('supports the forced status override', () => {
    const wrapper = mountSteps({ current: 0, status: 'error' })
    const items = wrapper.findAll('.lh-steps__item')
    // WrapperArray 无 every：按索引断言
    expect([...Array(items.length)].every((_, i) => items.at(i)!.classes().includes('lh-steps__item--error'))).toBe(true)
    wrapper.destroy()
  })

  it('applies the vertical direction class', () => {
    const wrapper = mountSteps({ direction: 'vertical' })
    expect(wrapper.find('.lh-steps--vertical').exists()).toBe(true)
    wrapper.destroy()
  })

  it('字符串型 current 归一化：当前步高亮且可点击', async () => {
    // current 可能以字符串传入（路由参数等）：旧实现「数字 === 字符串」恒不等，
    // 当前步不高亮，且点击当前步会误触发 change
    const wrapper = mountSteps({ current: '1', clickable: true })
    const items = wrapper.findAll('.lh-steps__item')
    expect(items.at(0)!.classes()).toContain('lh-steps__item--finish')
    expect(items.at(1)!.classes()).toContain('lh-steps__item--process')
    // 点当前步不触发（归一化后命中去重守卫）
    await items.at(1)!.find('button.lh-steps__head').trigger('click')
    expect(wrapper.emitted('change')).toBeFalsy()
    // 点历史步正常触发
    await items.at(0)!.find('button.lh-steps__head').trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
    wrapper.destroy()
  })
})
