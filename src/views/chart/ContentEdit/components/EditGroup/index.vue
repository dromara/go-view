<template>
  <div class="go-edit-group-box">
    <edit-shape-box
      :key="groupData.id"
      :data-id="groupData.id"
      :index="groupIndex"
      :item="groupData"
      :hiddenPoint="true"
      :class="animationsClass(groupData.styles.animations)"
      :style="{
        ...useComponentStyle(groupData.attr, groupIndex),
        ...useSizeStyle(groupData.attr),
        ...getFilterStyle(groupData.styles),
        ...getTransformStyle(groupData.styles)
      }"
      @click="mouseClickHandle($event, groupData)"
      @mousedown="mousedownHandle($event, groupData)"
      @mouseenter="mouseenterHandle($event, groupData)"
      @mouseleave="mouseleaveHandle($event, groupData)"
      @contextmenu="handleContextMenu($event, groupData, optionsHandle)"
    >
      <!-- 组合组件 -->
      <edit-shape-box
        v-for="item in groupData.groupList"
        :key="item.id"
        :data-id="item.id"
        :index="groupIndex"
        :item="item"
        :hiddenPoint="true"
        :style="{
          ...useComponentStyle(item.attr, groupIndex)
        }"
      >
        <component
          class="edit-content-chart"
          :class="animationsClass(item.styles.animations)"
          :is="item.chartConfig.chartKey"
          :chartConfig="item"
          :themeSetting="themeSetting"
          :themeColor="themeColor"
          :style="{
            ...useSizeStyle(item.attr),
            ...getFilterStyle(item.styles),
            ...getTransformStyle(item.styles)
          }"
        ></component>
      </edit-shape-box>
    </edit-shape-box>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import { MenuEnum } from '@/enums/editPageEnum'
import { chartColors } from '@/settings/chartThemes/index'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'
import { MenuOptionsItemType } from '@/views/chart/hooks/useContextMenu.hook.d'
import { animationsClass, getFilterStyle, getTransformStyle } from '@/utils'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useContextMenu, divider } from '@/views/chart/hooks/useContextMenu.hook'
import { useMouseHandle } from '../../hooks/useDrag.hook'
import { useComponentStyle, useSizeStyle } from '../../hooks/useStyle.hook'
import { EditShapeBox } from '../../components/EditShapeBox'

const props = defineProps({
  groupData: {
    type: Object as PropType<CreateComponentGroupType>,
    required: true
  },
  groupIndex: {
    type: Number,
    required: true
  }
})

const chartEditStore = useChartEditStore()
const { handleContextMenu } = useContextMenu()

// 点击事件
const { mouseenterHandle, mouseleaveHandle, mousedownHandle, mouseClickHandle } = useMouseHandle()

// 右键
const optionsHandle = (
  targetList: MenuOptionsItemType[],
  allList: MenuOptionsItemType[],
  targetInstance: CreateComponentType
) => {
  // 多选
  const moreMenuEnums = [MenuEnum.GROUP, MenuEnum.DELETE]
  // 单选
  const singleMenuEnums = [MenuEnum.UN_GROUP]

  const filter = (menulist: MenuEnum[]) => {
    const list: MenuOptionsItemType[] = []
    allList.forEach(item => {
      if (menulist.includes(item.key as MenuEnum)) {
        list.push(item)
      }
    })
    return list
  }

  // 多选处理
  if (chartEditStore.getTargetChart.selectId.length > 1) {
    return filter(moreMenuEnums)
  } else {
    return [...filter(singleMenuEnums), divider(), ...targetList]
  }
}

// 配置项
const themeColor = computed(() => {
  const chartThemeColor = chartEditStore.getEditCanvasConfig.chartThemeColor
  return chartColors[chartThemeColor]
})

// 主题色
const themeSetting = computed(() => {
  const chartThemeSetting = chartEditStore.getEditCanvasConfig.chartThemeSetting
  return chartThemeSetting
})
</script>
