<template>
  <div class="go-edit-select" v-if="isSelect" :style="positionStyle">
    <div class="select-background"></div>
    <div class="select-border"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch, computed } from 'vue'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { useSizeStyle, useComponentStyle } from '../../hooks/useStyle.hook'
import { selectBoxIndex } from '@/settings/designSetting'

// 全局颜色
const designStore = useDesignStore()
const chartEditStore = useChartEditStore()
const { isSelect, scale } = toRefs(chartEditStore.getEditCanvas)

const themeColor = computed(() => {
  return designStore.getAppTheme
})

// 位置
const positionStyle = ref()

watch(
  () => chartEditStore.getMousePosition,
  positionInfo => {
    if (!isSelect.value) return

    // 这里的 x,y 是已经计算过的相对位移值
    const { startX, startY, x, y } = positionInfo

    const attr = {
      zIndex: selectBoxIndex,
      // left
      x: 0,
      // top
      y: 0,
      // 宽
      w: 0,
      // 高
      h: 0,
      // 偏移
      offsetX: 0,
      offsetY: 0
    }

    // 处理位置
    if (x > startX && y > startY) {
      // 右下方向
      attr.x = startX
      attr.y = startY
      attr.w = Math.round((x - startX) / scale.value)
      attr.h = Math.round((y - startY) / scale.value)
    } else if (x > startX && y < startY) {
      // 右上方向
      attr.x = startX
      attr.w = Math.round((x - startX) / scale.value)
      attr.h = Math.round((startY - y) / scale.value)
      attr.y = startY - attr.h
    } else if (x < startX && y > startY) {
      // 左下方向
      attr.y = startY
      attr.w = Math.round((startX - x) / scale.value)
      attr.h = Math.round((y - startY) / scale.value)
      attr.x = startX - attr.w
    } else {
      // 左上方向
      attr.w = Math.round((startX - x) / scale.value)
      attr.h = Math.round((startY - y) / scale.value)
      attr.x = startX - attr.w
      attr.y = startY - attr.h
    }

    positionStyle.value = {
      ...useComponentStyle(attr, selectBoxIndex),
      ...useSizeStyle(attr)
    }
  },
  {
    deep: true
  }
)
</script>

<style lang="scss" scoped>
@include go('edit-select') {
  position: absolute;
  .select-border,
  .select-background {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
  }
  .select-border {
    left: 0;
    top: 0;
    opacity: 0.5;
    border-width: 2px;
    border-style: solid;
    border-color: v-bind('themeColor');
  }
  .select-background {
    top: 2px;
    left: 2px;
    opacity: 0.2;
    background-color: v-bind('themeColor');
  }
}
</style>
