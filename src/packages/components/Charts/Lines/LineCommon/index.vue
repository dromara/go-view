<template>
  <v-chart 
    ref="vChartRef" 
    :theme="themeColor" 
    :option="option.value" 
    :manual-update="isPreview()" 
    autoresize>
  </v-chart>
</template>

<script setup lang="ts">
import { PropType, watch, reactive } from 'vue';
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import config, { includes } from './config'
import { mergeTheme } from '@/packages/public/chart'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { chartColorsSearch, defaultTheme } from '@/settings/chartThemes/index'
import { DatasetComponent, GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { useChartDataFetch } from '@/hooks'
import { isPreview } from '@/utils'

const props = defineProps({
  themeSetting: {
    type: Object,
    required: true
  },
  themeColor: {
    type: Object,
    required: true
  },
  chartConfig: {
    type: Object as PropType<config>,
    required: true
  }
})

use([
  DatasetComponent,
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

const chartEditStore = useChartEditStore()
const option = reactive({
  value: {}
})

// 初始化与渐变色处理
watch(() => chartEditStore.getEditCanvasConfig.chartThemeColor, (newColor: keyof typeof chartColorsSearch) => {
  if (!isPreview()) {
    const themeColor = chartColorsSearch[newColor] || chartColorsSearch[defaultTheme]
    props.chartConfig.option.series.forEach((value: any) => {
      value.lineStyle.shadowColor = themeColor[2]
      value.lineStyle.color.colorStops.forEach((v: { color: string }, i: number) => {
        v.color = themeColor[i]
      })
    })
  }
  option.value = mergeTheme(props.chartConfig.option, props.themeSetting, includes)
  props.chartConfig.option = option.value
}, {
  immediate: true,
})


watch(() => props.chartConfig.option.dataset, () => {
  option.value = props.chartConfig.option
})

const { vChartRef } = useChartDataFetch(props.chartConfig, useChartEditStore)
</script>