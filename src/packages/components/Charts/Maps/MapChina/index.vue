<template>
  <v-chart ref="vChartRef" :theme="themeColor" :option="option.value" :manual-update="isPreview()" autoresize>
  </v-chart>
</template>

<script setup lang="ts">
import { PropType, reactive, watch } from 'vue'
import config, { includes } from './config'
import VChart from 'vue-echarts'
import { use, registerMap } from 'echarts/core'
import { EffectScatterChart, MapChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { useChartDataFetch } from '@/hooks'
import { mergeTheme } from '@/packages/public/chart'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { isPreview } from '@/utils'
import dataJson from './data.json'
import mapJson from './map.json'
import { DatasetComponent, GridComponent, TooltipComponent, LegendComponent, GeoComponent } from 'echarts/components'

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
  MapChart,
  DatasetComponent,
  CanvasRenderer,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  GeoComponent,
  EffectScatterChart
])

registerMap('china', { geoJSON: mapJson as any, specialAreas: {} })

const option = reactive({
  value: mergeTheme(props.chartConfig.option, props.themeSetting, includes)
})

const dataSetHandle = (dataset: any) => {
  props.chartConfig.option.series.forEach((item: any) => {
    if (item.type === 'effectScatter' && dataset.point) item.data = dataset.point
    else if (item.type === 'map' && dataset.point) item.data = dataset.map
    option.value = props.chartConfig.option
  })
}

watch(
  () => props.chartConfig.option.dataset,
  newData => {
    dataSetHandle(newData)
  },
  {
    immediate: true
  }
)

// 预览
useChartDataFetch(props.chartConfig, useChartEditStore, (newData: any) => {
  dataSetHandle(newData)
})
</script>
