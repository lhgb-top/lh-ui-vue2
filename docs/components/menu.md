# Menu 导航菜单

站点/应用主导航。水平/垂直两种布局，支持子菜单、分组、折叠条与手风琴。

<DemoBlock name="menu" title="导航菜单" :height="560">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="max-width: 640px; gap: 20px">
    <p class="demo-note">horizontal 水平模式</p>
    <LhMenu v-model="active" mode="horizontal">
      <LhMenuItem index="home">首页</LhMenuItem>
      <LhSubMenu index="song" title="宋代绘画">
        <LhMenuItem index="fan">范宽</LhMenuItem>
        <LhMenuItem index="guo">郭熙</LhMenuItem>
      </LhSubMenu>
      <LhMenuItem index="yuan" disabled>元代（禁用）</LhMenuItem>
    </LhMenu>
    <p class="demo-note">选中：{{ active }}</p>
    <p class="demo-note">vertical 垂直模式 + 手风琴（uniqueOpened）+ 分组</p>
    <LhMenu
      v-model="active2"
      mode="vertical"
      :collapse="collapsed"
      unique-opened
      :default-openeds="['g1']"
      style="width: 220px"
    >
      <LhSubMenu index="g1" title="山水卷">
        <LhMenuItemGroup title="北宋">
          <LhMenuItem index="fan2">范宽</LhMenuItem>
          <LhMenuItem index="guo2">郭熙</LhMenuItem>
        </LhMenuItemGroup>
        <LhMenuItemGroup title="南宋">
          <LhMenuItem index="li">李唐</LhMenuItem>
        </LhMenuItemGroup>
      </LhSubMenu>
      <LhMenuItem index="yuan2">元代绘画</LhMenuItem>
    </LhMenu>
    <LhButton size="small" @click="collapsed = !collapsed">{{ collapsed ? '展开' : '折叠' }}（collapse）</LhButton>
  </div>
</template>

<script>
export default {
  data: () => ({
    active: 'home',
    active2: 'fan2',
    collapsed: false,
  }),
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Menu Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 当前激活项（受控 modelValue；未传时组件内部维护） | `string` | — |
| mode | 布局模式 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| collapse | 垂直模式折叠为图标条（子菜单改为飞出面板） | `boolean` | `false` |
| defaultOpeneds | 默认展开的子菜单键（非受控） | `string[]` | — |
| openeds | 受控展开的子菜单键 | `string[]` | — |
| uniqueOpened | 手风琴：同时只展开一个子菜单 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## MenuItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| index | 唯一标识（必填） | `string` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## SubMenu Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| index | 唯一标识（必填） | `string` | — |
| title | 标题（也可用 title 插槽） | `string` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| sx | sx 快速布局属性 | — | — |

## MenuItemGroup Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 分组标题（也可用 title 插槽） | `string` | — |
| sx | sx 快速布局属性 | — | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| SubMenu title | 子菜单标题 |
| SubMenu default | 子菜单内容（放 MenuItem / MenuItemGroup） |
| MenuItemGroup title | 分组标题 |
| MenuItemGroup default | 分组内菜单项 |
