import { describe, expect, it } from 'vitest'
import { existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { lhComponents } from '../../src/index'

/** 目录名（kebab-case）→ 组件注册名（Lh + PascalCase） */
function toComponentName(dir: string): string {
  return 'Lh' + dir
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

describe('components registry', () => {
  it('asserts the exact ordered registry', () => {
    expect(lhComponents.map((c) => c.name)).toEqual([
      'LhConfigProvider',
      'LhButton',
      'LhIcon',
      'LhInput',
      'LhTag',
      'LhSwitch',
      'LhCheckbox',
      'LhCheckboxGroup',
      'LhRadio',
      'LhRadioGroup',
      'LhDialog',
      'LhTooltip',
      'LhSelect',
      'LhForm',
      'LhFormItem',
      'LhBadge',
      'LhAvatar',
      'LhSpinner',
      'LhDivider',
      'LhSpace',
      'LhCard',
      'LhEmpty',
      'LhSkeleton',
      'LhSkeletonItem',
      'LhAlert',
      'LhProgress',
      'LhStatistic',
      'LhDescriptions',
      'LhTimeline',
      'LhTimelineItem',
      'LhCollapse',
      'LhCollapseItem',
      'LhBreadcrumb',
      'LhBreadcrumbItem',
      'LhPagination',
      'LhCalendar',
      'LhDatePicker',
      'LhTimePicker',
      'LhCascader',
      'LhTree',
      'LhTreeSelect',
      'LhTable',
      'LhTransfer',
      'LhUpload',
      'LhTabs',
      'LhTabPane',
      'LhSteps',
      'LhStep',
      'LhInputNumber',
      'LhRate',
      'LhSegmented',
      'LhSlider',
      'LhPopover',
      'LhPopconfirm',
      'LhDrawer',
      'LhDropdown',
      'LhDropdownItem',
      'LhMessage',
      'LhNotification',
      'LhLoading',
      'LhLayout',
      'LhLayoutHeader',
      'LhLayoutAside',
      'LhLayoutMain',
      'LhLayoutFooter',
      'LhRow',
      'LhCol',
      'LhAffix',
      'LhBackTop',
      'LhAnchor',
      'LhImage',
      'LhMenu',
      'LhMenuItem',
      'LhSubMenu',
      'LhMenuItemGroup',
      'LhVirtualList',
    ])
  })

  it('reverse-checks every directory under src/components is registered', () => {
    const dir = join(dirname(fileURLToPath(import.meta.url)), '../../src/components')
    // 仅校验已成型组件（有 index.ts）；进行中的目录（如只有 types.ts）豁免
    const dirs = readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, 'index.ts')))
      .map((d) => d.name)
    const registered = new Set(lhComponents.map((c) => c.name))
    // 目录名推不出注册名的目录在此登记别名（如 grid 目录注册 LhRow/LhCol）
    const DIR_ALIASES: Record<string, string[]> = {
      grid: ['LhRow', 'LhCol'],
      backtop: ['LhBackTop'],
    }
    for (const name of dirs) {
      const aliases = DIR_ALIASES[name] ?? []
      if (aliases.length > 0) {
        expect(
          aliases.some((alias) => registered.has(alias)),
          `组件目录 ${name} 未注册到 lhComponents`,
        ).toBe(true)
      } else {
        expect(registered, `组件目录 ${name} 未注册到 lhComponents`).toContain(toComponentName(name))
      }
    }
  })
})
