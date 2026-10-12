import { describe, expect, it } from 'vitest'
import { mountComp as mount } from '../helpers'
import LhTree from '../../src/components/tree'
import type { LhTreeNode } from '../../src/components/tree'

const DATA: LhTreeNode[] = [
  {
    key: 'a',
    label: '节点 A',
    children: [
      { key: 'a-1', label: '节点 A-1' },
      { key: 'a-2', label: '节点 A-2', children: [{ key: 'a-2-1', label: '节点 A-2-1' }] },
    ],
  },
  { key: 'b', label: '节点 B' },
  { key: 'c', label: '节点 C', disabled: true },
]

describe('LhTree', () => {
  it('默认只渲染顶层节点', () => {
    const wrapper = mount(LhTree, { propsData: { data: DATA } })
    expect(wrapper.findAll('.lh-tree-node')).toHaveLength(3)
    expect(wrapper.find('.lh-tree-node__label').text()).toBe('节点 A')
    wrapper.destroy()
  })

  it('点击非叶子节点展开/收起子级', async () => {
    const wrapper = mount(LhTree, { propsData: { data: DATA } })
    await wrapper.find('.lh-tree-node').trigger('click')
    await wrapper.vm.$nextTick()
    // 展开 A 后可见：A、A-1、A-2、B、C
    expect(wrapper.findAll('.lh-tree-node')).toHaveLength(5)
    expect(wrapper.emitted('update:expandedKeys')).toEqual([[['a']]])
    expect(wrapper.emitted('expand')).toEqual([['a', true]])

    await wrapper.find('.lh-tree-node').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.lh-tree-node')).toHaveLength(3)
    expect(wrapper.emitted('expand')![1]).toEqual(['a', false])
    wrapper.destroy()
  })

  it('点击叶子节点触发 select（单选替换）', async () => {
    const wrapper = mount(LhTree, {
      propsData: { data: DATA, defaultExpandedKeys: ['a'] },
    })
    const nodes = wrapper.findAll('.lh-tree-node')
    // A-1 是第 2 个节点
    await nodes.at(1)!.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('update:selectedKeys')).toEqual([[['a-1']]])
    expect(wrapper.find('.lh-tree-node--selected').exists()).toBe(true)
    wrapper.destroy()
  })

  it('showCheckbox 勾选父子级联 + 半选态', async () => {
    const wrapper = mount(LhTree, {
      propsData: { data: DATA, showCheckbox: true, defaultExpandedKeys: ['a'] },
    })
    // 勾选 A-1（叶子）
    const nodes = wrapper.findAll('.lh-tree-node')
    const a1Checkbox = nodes.at(1)!.find('.lh-tree-node__checkbox')
    await a1Checkbox.trigger('click')
    expect(wrapper.emitted('update:checkedKeys')).toEqual([[['a-1']]])
    // A 应呈半选（部分子级勾选）
    const aCheckbox = nodes.at(0)!.find('.lh-tree-node__checkbox')
    expect(aCheckbox.classes()).toContain('lh-tree-node__checkbox--indeterminate')
    expect(aCheckbox.attributes('aria-checked')).toBe('mixed')
    wrapper.destroy()
  })

  it('checkedKeys 受控 + aria-checked', () => {
    const wrapper = mount(LhTree, {
      propsData: { data: DATA, showCheckbox: true, checkedKeys: ['a-1'], defaultExpandedKeys: ['a'] },
    })
    const checked = wrapper.find('.lh-tree-node__checkbox--checked')
    expect(checked.exists()).toBe(true)
    expect(checked.attributes('aria-checked')).toBe('true')
    wrapper.destroy()
  })

  it('disabled 节点不响应点击', async () => {
    const wrapper = mount(LhTree, { propsData: { data: DATA } })
    const nodes = wrapper.findAll('.lh-tree-node')
    const disabledNode = nodes.at(2)!
    expect(disabledNode.classes()).toContain('lh-tree-node--disabled')
    await disabledNode.trigger('click')
    expect(wrapper.emitted('select')).toBeFalsy()
    wrapper.destroy()
  })

  it('键盘导航：ArrowDown 移动焦点', async () => {
    const wrapper = mount(LhTree, { propsData: { data: DATA }, attachToDocument: true })
    await wrapper.find('.lh-tree-node[data-tree-key="a"]').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.vm.$nextTick()
    // 焦点移到 B（C disabled 跳过）
    const focused = document.activeElement as HTMLElement
    expect(focused.dataset.treeKey).toBe('b')
    wrapper.destroy()
  })

  it('expandOnClickNode=false 时点击叶子才选中，父节点不展开', async () => {
    const wrapper = mount(LhTree, {
      propsData: { data: DATA, expandOnClickNode: false },
    })
    await wrapper.find('.lh-tree-node').trigger('click')
    await wrapper.vm.$nextTick()
    // A 仍收起，但被选中
    expect(wrapper.findAll('.lh-tree-node')).toHaveLength(3)
    expect(wrapper.emitted('update:selectedKeys')).toEqual([[['a']]])
    wrapper.destroy()
  })

  it('懒加载：展开时调 load 并插入子级', async () => {
    const wrapper = mount(LhTree, {
      propsData: {
        data: [{ key: 'x', label: '懒节点', isLeaf: false }],
        lazy: true,
        load: (node: LhTreeNode, resolve: (children: LhTreeNode[]) => void) => {
          setTimeout(() => resolve([{ key: 'x-1', label: '懒子级' }]), 10)
        },
      },
    })
    await wrapper.find('.lh-tree-node').trigger('click')
    // 红线 #10：resolve 走 setTimeout，需等真实时钟推进
    await new Promise((r) => setTimeout(r, 50))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('nodeLoad')).toBeTruthy()
    // resolve 自动展开并插入子级
    expect(wrapper.findAll('.lh-tree-node')).toHaveLength(2)
    wrapper.destroy()
  })

  it('node 插槽自定义节点内容', () => {
    const wrapper = mount(LhTree, {
      propsData: { data: DATA },
      scopedSlots: {
        node: '<em class="my-node" slot-scope="{ node }">{{ node.label }}!</em>',
      },
    })
    expect(wrapper.find('.my-node').exists()).toBe(true)
    expect(wrapper.find('.my-node').text()).toBe('节点 A!')
    wrapper.destroy()
  })

  it('空数据渲染 empty 插槽', () => {
    const wrapper = mount(LhTree, { propsData: { data: [] } })
    expect(wrapper.find('.lh-tree__empty').text()).toBe('暂无数据')
    wrapper.destroy()
  })
})
