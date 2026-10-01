import { describe, expect, it } from 'vitest'
import { readdirSync } from 'node:fs'
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
    expect(lhComponents.map((c) => c.name)).toEqual(['LhConfigProvider'])
  })

  it('reverse-checks every directory under src/components is registered', () => {
    const dir = join(dirname(fileURLToPath(import.meta.url)), '../../src/components')
    const dirs = readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
    const registered = new Set(lhComponents.map((c) => c.name))
    for (const name of dirs) {
      expect(registered, `组件目录 ${name} 未注册到 lhComponents`).toContain(toComponentName(name))
    }
  })
})
