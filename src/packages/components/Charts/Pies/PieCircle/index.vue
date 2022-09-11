<template>
  <v-chart :theme="themeColor" :option="option.value" autoresize> </v-chart>
</template>

<script setup lang="ts">
import { PropType, reactive, watch } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { mergeTheme } from '@/packages/public/chart'
import config, { includes } from './config'
import { useChartDataFetch } from '@/hooks'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { DatasetComponent, GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components'

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

use([DatasetComponent, CanvasRenderer, PieChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent])

const option = reactive({
  value: {}
})

const dataHandle = (newData: any) => {
  const d = parseFloat(`${newData}`) * 100
  let config = props.chartConfig.option
  config.title.text = d.toFixed(2) + '%'
  config.series[0].data[0].value[0] = d
  config.series[0].data[1].value[0] = 100 - d
  option.value = mergeTheme(props.chartConfig.option, props.themeSetting, includes)
  option.value = props.chartConfig.option
}

// 配置时
watch(
  () => props.chartConfig.option.dataset,
  newData => dataHandle(newData),
  {
    immediate: true,
    deep: false
  }
)

// 预览时
useChartDataFetch(props.chartConfig, useChartEditStore, (resData: number) => {
  let d = parseFloat(`${resData}`) * 100
  // @ts-ignore
  option.value.title.text = d.toFixed(2) + '%'
  // @ts-ignore
  option.value.series[0].data[0].value[0] = d
  // @ts-ignore
  option.value.series[0].data[1].value[0] = 100 - d
})
</script>
