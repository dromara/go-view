<template>
  <div
    class="chart-item"
    v-for="(item, index) in localStorageInfo.componentList"
    :class="[animationsClass(item.styles.animations), !item.isGroup && 'hidden']"
    :key="item.id"
    :style="{
      ...getComponentAttrStyle(item.attr, index),
      ...getFilterStyle(item.styles),
      ...getTransformStyle(item.styles),
      ...getStatusStyle(item.status),
      ...getBlendModeStyle(item.styles) as any
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
      :id="item.id"
      :chartConfig="item"
      :themeSetting="themeSetting"
      :themeColor="themeColor"
      :style="{ ...getSizeStyle(item.attr) }"
      v-on="useLifeHandler(item)"
    ></component>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, onMounted } from 'vue'
import { useChartDataPondFetch } from '@/hooks'
import { ChartEditStorageType } from '../../index.d'
import { PreviewRenderGroup } from '../PreviewRenderGroup/index'
import { CreateComponentGroupType } from '@/packages/index.d'
import { chartColors } from '@/settings/chartThemes/index'
import { animationsClass, getFilterStyle, getTransformStyle, getBlendModeStyle } from '@/utils'
import { getSizeStyle, getComponentAttrStyle, getStatusStyle } from '../../utils'
import { useLifeHandler } from '@/hooks'

// 初始化数据池
const { initDataPond, clearMittDataPondMap } = useChartDataPondFetch()

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

// 组件渲染结束初始化数据池
clearMittDataPondMap()
onMounted(() => {
  initDataPond(props.localStorageInfo.requestGlobalConfig)
})
</script>

<style lang="scss" scoped>
.chart-item {
  position: absolute;
  &.hidden {
    overflow: hidden;
  }
}
</style>
