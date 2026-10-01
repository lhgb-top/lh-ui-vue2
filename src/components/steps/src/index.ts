import { computed, inject, onBeforeUnmount, provide, ref } from 'vue'
import { getStepsClassNames, getStepClassNames, getStepStatus } from '@lh-ui/share/core/steps'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
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
  // 子项在各自 setup 阶段注册 token，顺序即渲染顺序；
  // 序号/总数在注册完成的同一微任务批次内收敛，不会产生可见闪烁
  const itemTokens = ref<symbol[]>([])

  function select(index: number) {
    if (!props.clickable || index === props.current) return
    emit('update:current', index)
    emit('change', index)
  }

  provide(LH_STEPS_KEY, {
    itemTokens,
    current: computed(() => props.current ?? 0),
    clickable: computed(() => !!props.clickable),
    forcedStatus: computed(() => props.status),
    select,
  })

  const rootClasses = computed(() => getStepsClassNames(props.direction ?? 'horizontal'))
  const rootStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { rootClasses, rootStyle }
}

/**
 * Step 组件 Composable
 */
export function useLhStep(_props: LhStepProps) {
  const context = inject(LH_STEPS_KEY, null)

  // setup 阶段注册 token，顺序即渲染顺序；卸载时注销
  const token = Symbol('step')
  if (context) {
    context.itemTokens.value.push(token)
    onBeforeUnmount(() => {
      context.itemTokens.value = context.itemTokens.value.filter((item) => item !== token)
    })
  }

  const ownIndex = computed(() => (context ? context.itemTokens.value.indexOf(token) : -1))
  const total = computed(() => (context ? context.itemTokens.value.length : 1))
  const isLast = computed(() => ownIndex.value === total.value - 1)

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

  const itemClasses = computed(() =>
    getStepClassNames({ status: status.value, isLast: isLast.value, clickable: isButton.value }),
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

  return { ownIndex, status, isButton, itemClasses, iconChar, headBind, headOn }
}
