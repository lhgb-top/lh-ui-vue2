<script lang="ts">
import Vue from 'vue'

/**
 * 站点级布局外壳（VuePress 1.x）
 *
 * 作用：在默认主题布局之上注入站点专有元素（目前是暗色切换器 DarkToggle）。
 * 本主题 extends @vuepress/theme-default，但 v1 的主题继承不会把「每个页面都要
 * 渲染的悬浮元素」自动加进来——默认主题的 Layout.vue 只渲染 navbar / sidebar /
 * 页面内容。我们把父主题布局包一层，通过 page-bottom 插槽挂入 DarkToggle
 * （按钮自身 position: fixed，插槽位置不影响视觉）。
 *
 * 父主题布局通过 @parent-theme 别名引用（v1 主题继承约定：@theme 指向当前主题，
 * @parent-theme 指向被 extend 的主题）。本文件同时接管 Layout 这个布局名，
 * 使其成为站点的默认布局。
 */
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import DarkToggle from '../components/DarkToggle.vue'

export default Vue.extend({
  name: 'LhLayout',
  components: { ParentLayout, DarkToggle },
})
</script>

<template>
  <ParentLayout>
    <template #page-bottom>
      <DarkToggle />
    </template>
  </ParentLayout>
</template>
