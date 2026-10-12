import { describe, expect, it } from 'vitest'
import { mountComp } from '../helpers'
import LhUpload from '../../src/components/upload'

function makeFile(name: string, size = 100, type = 'text/plain'): File {
  const file = new File(['x'.repeat(size)], name, { type })
  return file
}

async function chooseFiles(wrapper: ReturnType<typeof mountComp>, files: File[]) {
  const input = wrapper.find('input[type="file"]')
  // jsdom 无 DataTransfer：用数组形态对象模拟 FileList（组件侧 Array.from(input.files)）
  const fakeList = Object.assign([...files], {
    item: (i: number) => files[i],
  })
  const inputEl = input.element as HTMLInputElement
  Object.defineProperty(inputEl, 'files', { value: fakeList, configurable: true })
  await input.trigger('change')
}

describe('LhUpload', () => {
  it('渲染触发区与隐藏 input', () => {
    const wrapper = mountComp(LhUpload)
    expect(wrapper.find('.lh-upload').exists()).toBe(true)
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
    expect(wrapper.find('.lh-upload__hint').text().trim()).toBe('选择文件')
    wrapper.destroy()
  })

  it('drag 模式提示文案', () => {
    const wrapper = mountComp(LhUpload, { propsData: { drag: true } })
    expect(wrapper.find('.lh-upload__hint').text().trim()).toContain('将文件拖到此处')
    wrapper.destroy()
  })

  it('选择文件后进入列表（ready 状态）', async () => {
    const wrapper = mountComp(LhUpload)
    await chooseFiles(wrapper, [makeFile('a.txt')])
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.lh-upload__list li')).toHaveLength(1)
    expect(wrapper.find('.lh-upload__file-name').text().trim()).toBe('a.txt')
    expect(wrapper.emitted('change')).toBeTruthy()
    wrapper.destroy()
  })

  it('multiple 支持多选', async () => {
    const wrapper = mountComp(LhUpload, { propsData: { multiple: true } })
    await chooseFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.lh-upload__list li')).toHaveLength(2)
    wrapper.destroy()
  })

  it('maxCount 数量限制：超出报错并截断', async () => {
    const wrapper = mountComp(LhUpload, { propsData: { maxCount: 1 } })
    await chooseFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.lh-upload__list li')).toHaveLength(1)
    expect(wrapper.find('.lh-upload__error').text().trim()).toBe('超出数量限制')
    wrapper.destroy()
  })

  it('maxSize 大小限制：超限不入列表', async () => {
    const wrapper = mountComp(LhUpload, { propsData: { maxSize: 50 } })
    await chooseFiles(wrapper, [makeFile('big.txt', 200)])
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.lh-upload__list li')).toHaveLength(0)
    expect(wrapper.find('.lh-upload__error').text().trim()).toBe('文件超出大小限制')
    wrapper.destroy()
  })

  it('accept 类型限制：扩展名不符被拒', async () => {
    const wrapper = mountComp(LhUpload, { propsData: { accept: '.png' } })
    await chooseFiles(wrapper, [makeFile('a.txt')])
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.lh-upload__list li')).toHaveLength(0)
    expect(wrapper.find('.lh-upload__error').text().trim()).toBe('文件类型不允许')
    wrapper.destroy()
  })

  it('request 上传流：进度 → 成功（success 事件）', async () => {
    const wrapper = mountComp(LhUpload, {
      propsData: {
        request: ({ onProgress }: { onProgress: (p: number) => void }) =>
          new Promise<{ url?: string }>((resolve) => {
            onProgress(50)
            setTimeout(() => resolve({ url: 'https://example.com/a.txt' }), 20)
          }),
      },
    })
    await chooseFiles(wrapper, [makeFile('a.txt')])
    await wrapper.vm.$nextTick()
    // 上传中：进度条渲染
    expect(wrapper.find('.lh-upload__progress').exists()).toBe(true)
    await new Promise((r) => setTimeout(r, 60))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.lh-upload__progress').exists()).toBe(false)
    expect(wrapper.find('.lh-upload__file-success').exists()).toBe(true)
    expect(wrapper.emitted('success')).toHaveLength(1)
    wrapper.destroy()
  })

  it('request 失败：error 事件与失败文案', async () => {
    const wrapper = mountComp(LhUpload, {
      propsData: {
        request: () => Promise.reject(new Error('网络错误')),
      },
    })
    await chooseFiles(wrapper, [makeFile('a.txt')])
    await new Promise((r) => setTimeout(r, 30))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.lh-upload__file-error').text().trim()).toBe('网络错误')
    expect(wrapper.emitted('error')).toBeTruthy()
    wrapper.destroy()
  })

  it('移除文件触发 remove 与 change', async () => {
    const wrapper = mountComp(LhUpload)
    await chooseFiles(wrapper, [makeFile('a.txt')])
    await wrapper.vm.$nextTick()
    await wrapper.find('.lh-upload__file-remove').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.findAll('.lh-upload__list li')).toHaveLength(0)
    wrapper.destroy()
  })

  it('disabled 禁止打开文件选择', async () => {
    const wrapper = mountComp(LhUpload, { propsData: { disabled: true } })
    expect(wrapper.find('.lh-upload--disabled').exists()).toBe(true)
    await wrapper.find('.lh-upload__trigger').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('change')).toBeFalsy()
    wrapper.destroy()
  })
})
