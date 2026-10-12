# Menu

Primary site or application navigation. Horizontal and vertical layouts, with submenus, groups, a collapsed bar, and accordion mode.

<DemoBlock name="menu" title="Menu" :height="560">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Currently active item (controlled `modelValue`; maintained internally when not passed) | `string` | — |
| mode | Layout mode | `'horizontal' \| 'vertical'` | `'horizontal'` |
| collapse | Collapses vertical mode into an icon bar (submenus become flyout panels) | `boolean` | `false` |
| defaultOpeneds | Keys of submenus expanded by default (uncontrolled) | `string[]` | — |
| openeds | Keys of submenus expanded (controlled) | `string[]` | — |
| uniqueOpened | Accordion mode: only one submenu expanded at a time | `boolean` | `false` |
| sx | sx shorthand layout prop | — | — |

## MenuItem Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| index | Unique identifier (required) | `string` | — |
| disabled | Whether the item is disabled | `boolean` | `false` |
| sx | sx shorthand layout prop | — | — |

## SubMenu Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| index | Unique identifier (required) | `string` | — |
| title | Title (a title slot is also available) | `string` | — |
| disabled | Whether the submenu is disabled | `boolean` | `false` |
| sx | sx shorthand layout prop | — | — |

## MenuItemGroup Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Group title (a title slot is also available) | `string` | — |
| sx | sx shorthand layout prop | — | — |

## Slots

| Slot | Description |
| --- | --- |
| SubMenu title | Submenu title |
| SubMenu default | Submenu content (place MenuItem / MenuItemGroup here) |
| MenuItemGroup title | Group title |
| MenuItemGroup default | Menu items inside the group |
