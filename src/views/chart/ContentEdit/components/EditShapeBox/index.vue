<template>
  <div class="go-shape-box">
    <slot></slot>
    <!-- 锚点 -->
    <div
      :class="`shape-point ${point}`"
      v-for="(point, index) in (select? pointList : [])"
      :key="index"
      :style="usePointStyle(point, index, item.attr, cursorResize)"
      @mousedown="useMousePointHandle($event, point, item.attr)"
   ></div>

    <!-- 选中 -->
    <div class="shape-modal" :style="useSizeStyle(item.attr)">
      <div class="shape-modal-select" :class="{ active: select }"></div>
      <div
        class="shape-modal-change"
        :class="{ selectActive: select, hoverActive: hover }"
     ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType, toRefs } from 'vue'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { CreateComponentType } from '@/packages/index.d'
import { useSizeStyle, usePointStyle } from '../../hooks/useStyle.hook'
import { useMousePointHandle } from '../../hooks/useDrag.hook'

const props = defineProps({
  item: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

// 全局颜色
const designStore = useDesignStore()
const themeColor = ref(designStore.getAppTheme)
const chartEditStore = useChartEditStore()

// 锚点
const pointList = ['t', 'r', 'b', 'l', 'lt', 'rt', 'lb', 'rb']

// 光标朝向
const cursorResize = ['n', 'e', 's', 'w', 'nw', 'ne', 'sw', 'se']

// 计算当前选中目标
const hover = computed(() => {
  return props.item.id === chartEditStore.getTargetChart.hoverId
})

const select = computed(() => {
  return props.item.id === chartEditStore.getTargetChart.selectId
})
</script>

<style lang="scss" scoped>
@include go(shape-box) {
  position: absolute;
  cursor: move;
  /* 锚点 */
  .shape-point {
    z-index: 1;
    position: absolute;
    width: 7px;
    height: 7px;
    border: 3px solid v-bind('themeColor');
    border-radius: 5px;
    background-color: #fff;
    transform: translate(-40%, -30%);
    &.t, 
    &.b {
      width: 30px;
    }
    &.l, 
    &.r {
      height: 30px;
    }
    &.r, 
    &.rt, 
    &.rb
    {
      transform: translate(-30%, -30%);
    }
  }
  /* 选中 */
  .shape-modal {
    position: absolute;
    top: 0;
    left: 0;

    .shape-modal-select,
    .shape-modal-change {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }

    .shape-modal-select {
      opacity: 0.1;
      top: 2px;
      left: 2px;
      &.active {
        background-color: v-bind('themeColor');
      }
    }
    .shape-modal-change {
      border: 2px solid rgba(0, 0, 0, 0);
      &.selectActive,
      &.hoverActive {
        border-color: v-bind('themeColor');
        border-width: 2px;
      }
      &.hoverActive {
        border-style: dotted;
      }
      &.selectActive {
        border-style: solid;
      }
    }
  }
}
</style>
