import { describe, expect, it } from 'vitest'
import { mountComp as mount } from '../helpers'
import LhTable from '../../src/components/table'
import type { LhTableColumn } from '../../src/components/table'

interface Row {
  id: number
  name: string
  age: number
  city: string
}

const COLUMNS: LhTableColumn[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', sortable: true },
  { prop: 'city', label: '城市' },
]

const DATA: Row[] = [
  { id: 1, name: '张三', age: 30, city: '杭州' },
  { id: 2, name: '李四', age: 25, city: '苏州' },
  { id: 3, name: '王五', age: 35, city: '南京' },
]

const flush = () => new Promise((r) => setTimeout(r, 150))
const filterPanel = () => document.querySelector('.lh-table__filter-panel') as HTMLElement

describe('LhTable', () => {
  it('渲染表头与行数据', () => {
    const wrapper = mount(LhTable, { propsData: { data: DATA, columns: COLUMNS } })
    expect(wrapper.find('.lh-table').exists()).toBe(true)
    expect(wrapper.findAll('.lh-table__header-row')).toHaveLength(1)
    expect(wrapper.findAll('.lh-table__row')).toHaveLength(3)
    const firstCell = wrapper.find('.lh-table__row')
    expect(firstCell.text()).toContain('张三')
    wrapper.destroy()
  })

  it('空数据渲染 empty 插槽', () => {
    const wrapper = mount(LhTable, { propsData: { data: [], columns: COLUMNS } })
    expect(wrapper.find('.lh-table__empty').text()).toBe('暂无数据')
    wrapper.destroy()
  })

  it('点击排序表头触发 sortChange 并排序', async () => {
    const wrapper = mount(LhTable, { propsData: { data: DATA, columns: COLUMNS } })
    await wrapper.find('.lh-table__sort-trigger').trigger('click')
    expect(wrapper.emitted('sortChange')).toEqual([[{ prop: 'age', order: 'asc' }]])
    // 升序后首行是 25（李四）
    expect(wrapper.find('.lh-table__row').text()).toContain('李四')

    // 再点一次切降序
    await wrapper.find('.lh-table__sort-trigger').trigger('click')
    expect(wrapper.emitted('sortChange')![1]).toEqual([{ prop: 'age', order: 'desc' }])
    expect(wrapper.find('.lh-table__row').text()).toContain('王五')

    // 第三次取消排序
    await wrapper.find('.lh-table__sort-trigger').trigger('click')
    expect(wrapper.emitted('sortChange')![2]).toEqual([{ prop: 'age', order: undefined }])
    wrapper.destroy()
  })

  it('aria-sort 反映当前排序方向', async () => {
    const wrapper = mount(LhTable, { propsData: { data: DATA, columns: COLUMNS } })
    const sortableHeader = wrapper.find('[role="columnheader"]:nth-child(2)')
    expect(sortableHeader.attributes('aria-sort')).toBe('none')
    await wrapper.find('.lh-table__sort-trigger').trigger('click')
    expect(sortableHeader.attributes('aria-sort')).toBe('ascending')
    wrapper.destroy()
  })

  it('行点击触发 rowClick 带行数据与下标', async () => {
    const wrapper = mount(LhTable, { propsData: { data: DATA, columns: COLUMNS } })
    const rows = wrapper.findAll('.lh-table__row')
    await rows.at(1)!.trigger('click')
    expect(wrapper.emitted('rowClick')).toEqual([[DATA[1], 1]])
    wrapper.destroy()
  })

  it('斑马纹 / 边框 / 尺寸类名', () => {
    const wrapper = mount(LhTable, {
      propsData: { data: DATA, columns: COLUMNS, stripe: true, border: true, size: 'small' },
    })
    const root = wrapper.find('.lh-table')
    expect(root.classes()).toContain('lh-table--stripe')
    expect(root.classes()).toContain('lh-table--border')
    expect(root.classes()).toContain('lh-table--small')
    wrapper.destroy()
  })

  it('filters 列渲染筛选触发器，打开面板（挂 body）勾选确定后过滤', async () => {
    const columns: LhTableColumn[] = [
      { prop: 'name', label: '姓名' },
      { prop: 'age', label: '年龄', sortable: true },
      {
        prop: 'city',
        label: '城市',
        filters: [
          { text: '杭州', value: '杭州' },
          { text: '苏州', value: '苏州' },
        ],
      },
    ]
    const wrapper = mount(LhTable, { propsData: { data: DATA, columns }, attachToDocument: true })
    // 筛选触发器在第 3 列
    await wrapper.find('.lh-table__filter-trigger').trigger('click')
    await flush()
    const panel = filterPanel()
    expect(panel).toBeTruthy()
    expect(panel.closest('.lh-table')).toBeNull()

    // 勾选「杭州」并确定
    const checkbox = panel.querySelector('input[type="checkbox"]') as HTMLInputElement
    checkbox.click()
    await flush()
    const confirmBtn = panel.querySelector('.lh-table__filter-btn--primary') as HTMLElement
    confirmBtn.click()
    await flush()
    expect(wrapper.emitted('filterChange')).toEqual([[{ prop: 'city', values: ['杭州'] }]])
    expect(wrapper.emitted('update:filteredValues')).toBeTruthy()
    // 只剩张三一行
    expect(wrapper.findAll('.lh-table__row')).toHaveLength(1)
    expect(filterPanel()).toBeNull()
    wrapper.destroy()
  })

  it('受控 filteredValues 驱动过滤', () => {
    const columns: LhTableColumn[] = [
      { prop: 'name', label: '姓名' },
      { prop: 'age', label: '年龄' },
      {
        prop: 'city',
        label: '城市',
        filters: [
          { text: '杭州', value: '杭州' },
          { text: '苏州', value: '苏州' },
        ],
      },
    ]
    const wrapper = mount(LhTable, {
      propsData: {
        data: DATA,
        columns,
        filteredValues: { city: ['苏州'] },
      },
    })
    expect(wrapper.findAll('.lh-table__row')).toHaveLength(1)
    expect(wrapper.find('.lh-table__row').text()).toContain('李四')
    wrapper.destroy()
  })

  it('height 启用虚拟滚动（v--virtual 类名 + 行高样式）', () => {
    const bigData = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `行 ${i}`,
      age: i,
      city: '城市',
    }))
    const wrapper = mount(LhTable, {
      propsData: { data: bigData, columns: COLUMNS, height: 240, rowHeight: 48 },
      attachToDocument: true,
    })
    expect(wrapper.find('.lh-table--virtual').exists()).toBe(true)
    // 视口 240 / 行高 48 = 5 行 + overscan
    const rows = wrapper.findAll('.lh-table__row')
    expect(rows.length).toBeLessThan(100)
    expect(rows.length).toBeGreaterThan(3)
    wrapper.destroy()
  })

  it('column.slot 插槽自定义单元格', () => {
    const columns: LhTableColumn[] = [{ prop: 'name', label: '姓名', slot: 'name' }]
    const wrapper = mount(LhTable, {
      propsData: { data: DATA, columns },
      scopedSlots: {
        name: '<b class="my-cell" slot-scope="{ row }">{{ row.name }}!</b>',
      },
    })
    expect(wrapper.find('.my-cell').exists()).toBe(true)
    expect(wrapper.find('.my-cell').text()).toBe('张三!')
    wrapper.destroy()
  })

  it('formatter 格式化单元格值', () => {
    const columns: LhTableColumn[] = [
      { prop: 'name', label: '姓名' },
      { prop: 'age', label: '年龄', formatter: (_row, value) => `${value} 岁` },
    ]
    const wrapper = mount(LhTable, { propsData: { data: DATA, columns } })
    expect(wrapper.find('.lh-table__row').text()).toContain('30 岁')
    wrapper.destroy()
  })

  it('rowClick 与插槽共存（插槽内容触发冒泡的行点击）', async () => {
    const columns: LhTableColumn[] = [{ prop: 'name', label: '姓名', slot: 'name' }]
    const wrapper = mount(LhTable, {
      propsData: { data: DATA, columns },
      scopedSlots: {
        name: '<button class="my-btn" slot-scope="{ row }">{{ row.name }}</button>',
      },
    })
    await wrapper.find('.my-btn').trigger('click')
    expect(wrapper.emitted('rowClick')).toEqual([[DATA[0], 0]])
    wrapper.destroy()
  })
})
