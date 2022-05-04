<template>
  <div
    class="go-edit-range go-transition"
    :style="rangeStyle"
    @mousedown="mousedownHandleUnStop($event, undefined)"
  >
    <slot></slot>
    <!-- 水印 -->
    <edit-watermark></edit-watermark>
    <!-- 标尺 -->
    <edit-rule></edit-rule>
    <!-- 拖拽时的辅助线 -->
    <edit-align-line></edit-align-line>
    <!-- 拖拽时的遮罩 -->
    <div class="go-edit-range-model" :style="rangeModelStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'
import { useSizeStyle } from '../../hooks/useStyle.hook'
import { mousedownHandleUnStop } from '../../hooks/useDrag.hook'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditAlignLine } from '../EditAlignLine'
import { EditWatermark } from '../EditWatermark'
import { EditRule } from '../EditRule'

const chartEditStore = useChartEditStore()

const { getEditCanvasConfig, getEditCanvas } = toRefs(chartEditStore)

const size = computed(() => {
  return {
    w: getEditCanvasConfig.value.width,
    h: getEditCanvasConfig.value.height
  }
})

const rangeStyle = computed(() => {
  // 缩放
  const scale = {
    transform: `scale(${getEditCanvas.value.scale})`
  }
  // 设置背景色和图片背景
  const background = getEditCanvasConfig.value.background
  const backgroundImage = getEditCanvasConfig.value.backgroundImage
  const selectColor = getEditCanvasConfig.value.selectColor
  const backgroundColor = background ? background : undefined

  const computedBackground = selectColor
    ? { background: backgroundColor }
    : { background: `url(${backgroundImage}) no-repeat center/100% !important` }

  // @ts-ignore
  return { ...useSizeStyle(size.value), ...computedBackground, ...scale }
})

// 模态层
const rangeModelStyle = computed(() => {
  const dragStyle = getEditCanvas.value.isCreate && { 'z-index': 99999 }
  // @ts-ignore
  return { ...useSizeStyle(size.value), ...dragStyle }
})
</script>

<style lang="scss" scoped>
@include go(edit-range) {
  position: relative;
  transform-origin: left top;
  background-size: cover;
  @include fetch-border-color('hover-border-color');
  @include fetch-bg-color('background-color2');
  @include go(edit-range-model) {
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
