<template>
  <content-box
    class="go-content-layers"
    :class="{ scoped: !chartLayoutStore.getLayers }"
    title="图层"
    :depth="2"
    @back="backHandle"
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
    <draggable
      item-key="id"
      tag="transition-group"
      v-model="reverseList"
      ghostClass="ghost"
      @change="onMoveCallback"
    >
      <template #item="{ element }">
        <layers-list-item
          :componentData="element"
          @mousedown="mousedownHandle(element)"
          @mouseenter="mouseenterHandle(element)"
          @mouseleave="mouseleaveHandle(element)"
          @contextmenu="handleContextMenu($event, element)"
        ></layers-list-item>
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
import { CreateComponentType } from '@/packages/index.d'
import { useContextMenu } from '@/views/chart/hooks/useContextMenu.hook'
import { MenuEnum } from '@/enums/editPageEnum'

import { LayersListItem } from './components/LayersListItem/index'
import { icon } from '@/plugins'

const { LayersIcon } = icon.ionicons5
const chartLayoutStore = useChartLayoutStore()
const chartEditStore = useChartEditStore()

const { handleContextMenu } = useContextMenu()

// 逆序展示
const reverseList = computed(() => {
  const list: CreateComponentType[] = cloneDeep(chartEditStore.getComponentList)
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

// 点击事件
const mousedownHandle = (item: CreateComponentType) => {
  chartEditStore.setTargetSelectChart(item.id)
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
