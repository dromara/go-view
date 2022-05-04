<template>
  <v-chart
    ref="vChartRef"
    :theme="themeColor"
    :option="option.value"
    :manual-update="isPreview()"
    autoresize
  ></v-chart>
</template>

<script setup lang="ts">
import { PropType, watch, reactive } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import 'echarts-liquidfill/src/liquidFill.js'
import { CanvasRenderer } from 'echarts/renderers'
import { GridComponent } from 'echarts/components'
import config  from './config'
import { isPreview } from '@/utils'
import { chartColorsSearch, defaultTheme } from '@/settings/chartThemes/index'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useChartDataFetch } from '@/hooks'

const props = defineProps({
  themeSetting: {
    type: Object,
    required: true,
  },
  themeColor: {
    type: Object,
    required: true,
  },
  chartConfig: {
    type: Object as PropType<config>,
    required: true,
  },
})

use([CanvasRenderer, GridComponent])

const chartEditStore = useChartEditStore()

const option = reactive({
  value: {},
})

// 渐变色处理
watch(
  () => chartEditStore.getEditCanvasConfig.chartThemeColor,
  (newColor: keyof typeof chartColorsSearch) => {
    if (!isPreview()) {
      const themeColor = chartColorsSearch[newColor] || chartColorsSearch[defaultTheme]
      // 背景颜色
      props.chartConfig.option.series[0].backgroundStyle.color = themeColor[2]
      // 水球颜色
      props.chartConfig.option.series[0].color[0].colorStops = [  
        {
          offset: 0,
          color: themeColor[0],
        },
        {
          offset: 1,
          color: themeColor[1],
        },
      ]
    }
    option.value = props.chartConfig.option
  },
  {
    immediate: true,
  }
)

const updateDataset = (newData: string | number) => {
  props.chartConfig.option.series[0].data = [parseFloat(`${newData}`).toFixed(2)]
  option.value = props.chartConfig.option
}

watch(
  () => props.chartConfig.option.dataset,
  newData => updateDataset(newData),
  {
    immediate: true,
  }
)

const { vChartRef } = useChartDataFetch(props.chartConfig, useChartEditStore)
</script>
