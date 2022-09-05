<template>
  <content-box
    class="go-content-layers"
    :class="{ scoped: !chartLayoutStore.getLayers }"
    title="图层"
    :depth="2"
    @back="backHandle"
    @mousedown="boxMousedownHandle($event)"
  >
    <template #icon>
      <n-icon size="16" :depth="2">
        <component :is="LayersIcon"></component>
      </n-icon>
    </template>
    <!-- 图层内容 -->
    <n-space v-if="reverseList.length === 0" justify="center">
      <n-text class="not-layer-text">暂无图层~</n-text>
    </n-space>
    <!-- https://github.com/SortableJS/vue.draggable.next -->
    <draggable item-key="id" v-model="reverseList" ghostClass="ghost" @change="onMoveCallback">
      <template #item="{ element }">
        <div class="go-content-layer-box">
          <!-- 组合 -->
          <layers-group-list-item v-if="element.isGroup" :componentGroupData="element"></layers-group-list-item>
          <!-- 单组件 -->
          <layers-list-item
            v-else
            :componentData="element"
            @mousedown="mousedownHandle($event, element)"
            @mouseenter="mouseenterHandle(element)" 
            @mouseleave="mouseleaveHandle(element)"
            @contextmenu="handleContextMenu($event, element, optionsHandle)"
          ></layers-list-item>
        </div>
      </template>
    </draggable>
  </content-box>
</template>

<script setup lang="ts">
import { computed, toRaw } from 'vue'
import Draggable from 'vuedraggable'
import cloneDeep from 'lodash/cloneDeep'
import { ContentBox } from '../ContentBox/index'
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore'
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'
import { MenuOptionsItemType } from '@/views/chart/hooks/useContextMenu.hook.d'
import { useContextMenu } from '@/views/chart/hooks/useContextMenu.hook'
import { MenuEnum, MouseEventButton, WinKeyboard, MacKeyboard } from '@/enums/editPageEnum'

import { LayersListItem } from './components/LayersListItem/index'
import { LayersGroupListItem } from './components/LayersGroupListItem/index'

import { icon } from '@/plugins'

const { LayersIcon } = icon.ionicons5
const chartLayoutStore = useChartLayoutStore()
const chartEditStore = useChartEditStore()

const { handleContextMenu, onClickOutSide } = useContextMenu()

// 右键事件
const optionsHandle = (
  targetList: MenuOptionsItemType[],
  allList: MenuOptionsItemType[],
  targetInstance: CreateComponentType
) => {
  // 多选处理
  if (chartEditStore.getTargetChart.selectId.length > 1) {
    const list: MenuOptionsItemType[] = []
    targetList.forEach(item => {
      // 成组
      if (item.key === MenuEnum.GROUP) {
        list.push(item)
      }
    })
    return list
  }
  return targetList
}
 
// 逆序展示
const reverseList = computed(() => {
  const list: Array<CreateComponentType | CreateComponentGroupType> = cloneDeep(chartEditStore.getComponentList)
  return list.reverse()
})

// 缩小
const backHandle = () => {
  chartLayoutStore.setItem(ChartLayoutStoreEnum.LAYERS, false)
}

// 移动结束处理
const onMoveCallback = (val: any) => {
  const { oldIndex, newIndex } = val.moved
  const moveTarget = toRaw(val.moved.element)
  if (newIndex - oldIndex > 0) {
    // 从上往下
    chartEditStore.getComponentList.splice(-(oldIndex + 1), 1)
    chartEditStore.getComponentList.splice(-newIndex, 0, moveTarget)
  } else {
    // 从下往上
    chartEditStore.getComponentList.splice(-(oldIndex + 1), 1)
    if (newIndex === 0) {
      chartEditStore.getComponentList.push(moveTarget)
    } else {
      chartEditStore.getComponentList.splice(-newIndex, 0, moveTarget)
    }
  }
}

const boxMousedownHandle = (e: MouseEvent) => {
  const box = document.querySelector('.go-content-layer-box')
  if ((e.target as any).contains(box)) {
    chartEditStore.setTargetSelectChart()
  }
}

// 点击事件
const mousedownHandle = (e: MouseEvent, item: CreateComponentType) => {
  onClickOutSide()
  // 若此时按下了 CTRL, 表示多选
  const id = item.id
  if (
    e.buttons === MouseEventButton.LEFT &&
    (window.$KeyboardActive?.has(WinKeyboard.CTRL_SOURCE_KEY) ||
      window.$KeyboardActive?.has(MacKeyboard.CTRL_SOURCE_KEY))
  ) {
    // 若已选中，则去除
    if (chartEditStore.targetChart.selectId.includes(id)) {
      const exList = chartEditStore.targetChart.selectId.filter(e => e !== id)
      chartEditStore.setTargetSelectChart(exList)
    } else {
      chartEditStore.setTargetSelectChart(id, true)
    }
    return
  }
  chartEditStore.setTargetSelectChart(id)
}

// 进入事件
const mouseenterHandle = (item: CreateComponentType) => {
  chartEditStore.setTargetHoverChart(item.id)
}

// 移出事件
const mouseleaveHandle = (item: CreateComponentType) => {
  chartEditStore.setTargetHoverChart(undefined)
}
</script>

<style lang="scss" scoped>
$wight: 170px;
@include go(content-layers) {
  width: $wight;
  flex-shrink: 0;
  overflow: hidden;
  @extend .go-transition;
  .not-layer-text {
    position: relative;
    top: 10px;
    white-space: nowrap;
    opacity: 0.4;
  }
  &.scoped {
    width: 0;
  }
  .ghost {
    opacity: 0;
  }
}
</style>
