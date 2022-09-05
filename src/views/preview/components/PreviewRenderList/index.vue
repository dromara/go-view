<template>
  <div
    class="chart-item"
    v-for="(item, index) in localStorageInfo.componentList"
    :class="animationsClass(item.styles.animations)"
    :key="item.id"
    :style="{
      ...getComponentAttrStyle(item.attr, index),
      ...getFilterStyle(item.styles),
      ...getTransformStyle(item.styles)
    }"
  >
    <!-- 分组 -->
    <preview-render-group
      v-if="item.isGroup"
      :groupData="(item as CreateComponentGroupType)"
      :groupIndex="index"
      :themeSetting="themeSetting"
      :themeColor="themeColor"
    ></preview-render-group>

    <!-- 单组件 -->
    <component
      v-else
      :is="item.chartConfig.chartKey"
      :chartConfig="item"
      :themeSetting="themeSetting"
      :themeColor="themeColor"
      :style="{ ...getSizeStyle(item.attr) }"
    ></component>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { ChartEditStorageType } from '../../index.d'
import { PreviewRenderGroup } from '../PreviewRenderGroup/index'
import { CreateComponentGroupType } from '@/packages/index.d'
import { chartColors } from '@/settings/chartThemes/index'
import { animationsClass, getFilterStyle, getTransformStyle } from '@/utils'
import { getSizeStyle, getComponentAttrStyle } from '../../utils'

const props = defineProps({
  localStorageInfo: {
    type: Object as PropType<ChartEditStorageType>,
    required: true
  }
})

// 主题色
const themeSetting = computed(() => {
  const chartThemeSetting = props.localStorageInfo.editCanvasConfig.chartThemeSetting
  return chartThemeSetting
})

// 配置项
const themeColor = computed(() => {
  const chartThemeColor = props.localStorageInfo.editCanvasConfig.chartThemeColor
  return chartColors[chartThemeColor]
})
</script>

<style lang="scss" scoped>
.chart-item {
  position: absolute;
}
</style>
