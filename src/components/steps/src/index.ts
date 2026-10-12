import { computed, inject, onBeforeUnmount, provide, ref } from 'vue'
import { getStepsClassNames, getStepClassNames, getStepStatus } from '@lh-ui/share/core/steps'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { generateId } from '@lh-ui/share/utils'
import { t } from '../../../locale'
import { LH_STEPS_KEY } from './types'
import type { LhStepProps, LhStepsProps } from './types'

export interface LhStepsEmits {
  /** 双向绑定走 .sync 语义（事件名 update:current） */
  (e: 'update:current', index: number): void
  (e: 'change', index: number): void
}

/**
 * Steps 组件 Composable（纯逻辑在 @lh-ui/share/core/steps；文案走 locale 适配层）
 */
export function useLhSteps(props: LhStepsProps, emit: LhStepsEmits) {
  // 子项 setup 阶段注册 uid（首帧顺序即渲染顺序）；父级 onUpdated 按 DOM 位序重排——
  // 中段 v-if 的 step 卸载重挂曾被 push 到数组尾，步骤序号与 DOM 顺序脱钩
  const itemTokens = ref<string[]>([])
  // 横向定宽折行时，每行最后一项的索引（纵向布局无折行，恒为空）；
  // 由 index.vue 测量各子项 offsetTop 后经 getStepsLineLastIndices 回填
  const lineLastIndices = ref<number[]>([])

  function select(index: number) {
    // current 可能以字符串传入（路由参数、表单绑定等），统一归一化再比较；
    // 否则「数字 === 字符串」恒不等：当前步不高亮、重复点击也触发 change
    const current = Number(props.current ?? 0)
    if (!props.clickable || index === current) return
    emit('update:current', index)
    emit('change', index)
  }

  provide(LH_STEPS_KEY, {
    itemTokens,
    current: computed(() => Number(props.current ?? 0)),
    clickable: computed(() => !!props.clickable),
    forcedStatus: computed(() => props.status),
    lineLastIndices,
    select,
  })

  const rootClasses = computed(() => getStepsClassNames(props.direction ?? 'horizontal'))
  const rootStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { rootClasses, rootStyle, itemTokens, lineLastIndices }
}

/**
 * Step 组件 Composable
 */
export function useLhStep(_props: LhStepProps) {
  const context = inject(LH_STEPS_KEY, null)

  // setup 阶段注册 uid（首帧顺序即渲染顺序）；uid 同步落到 DOM（data-lh-step-item），
  // 供父级 onUpdated 按 DOM 位序重排；卸载时注销
  const uid = generateId('lh-step')
  if (context) {
    context.itemTokens.value.push(uid)
    onBeforeUnmount(() => {
      context.itemTokens.value = context.itemTokens.value.filter((item) => item !== uid)
    })
  }

  const ownIndex = computed(() => (context ? context.itemTokens.value.indexOf(uid) : -1))

  const status = computed(() =>
    getStepStatus({
      index: ownIndex.value,
      current: context?.current.value ?? 0,
      forced: context?.forcedStatus.value,
    }),
  )

  const clickable = computed(() => !!context?.clickable.value)
  // 当前步骤与历史步骤可点击导航；等待中的后续步骤不引导跳转
  const isButton = computed(() => clickable.value && status.value !== 'wait')

  // 折行时每行末项的连接线会指向行尾空白，据此输出类名由样式层隐藏；
  // 结构性末项（全局最后一项）的连接线由 share styles 的 :last-child 承担——
  // 子项在各自 setup 阶段渲染，后续兄弟尚未注册，靠总数判 isLast 会让首屏每项都误判为末项
  const isLineLast = computed(() =>
    context ? context.lineLastIndices.value.includes(ownIndex.value) : false,
  )

  const itemClasses = computed(() =>
    getStepClassNames({ status: status.value, lineLast: isLineLast.value, clickable: isButton.value }),
  )

  const iconChar = computed(() => {
    if (status.value === 'finish') return '✓'
    if (status.value === 'error') return '✕'
    return ownIndex.value + 1
  })

  const stepLabel = computed(() => {
    if (status.value === 'finish') return t('steps.finish', '已完成')
    if (status.value === 'error') return t('steps.error', '错误')
    return t('steps.step', '第 {index} 步').replace('{index}', String(ownIndex.value + 1))
  })

  // 2.7 v-bind 对象不能携带监听器：bind/on 分开传（v-bind + v-on）
  const headBind = computed(() =>
    isButton.value ? { type: 'button', 'aria-label': stepLabel.value } : {},
  )
  const headOn = computed(() =>
    isButton.value ? { click: () => context?.select(ownIndex.value) } : {},
  )

  return { ownIndex, uid, status, isButton, itemClasses, iconChar, headBind, headOn }
}
