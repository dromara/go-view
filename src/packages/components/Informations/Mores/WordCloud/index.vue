<template>
  <v-chart
    ref="vChartRef"
    :theme="themeColor"
    :option="option"
    :manual-update="isPreview()"
    :update-options="{ replaceMerge: replaceMergeArr }"
    autoresize
  ></v-chart>
</template>

<script setup lang="ts">
import { ref, computed, watch, PropType } from 'vue'
import VChart from 'vue-echarts'
import 'echarts-wordcloud'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import config, { includes } from './config'
import { mergeTheme } from '@/packages/public/chart'
import { useChartDataFetch } from '@/hooks'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { isPreview } from '@/utils'
import { GridComponent, TooltipComponent } from 'echarts/components'
import dataJson from './data.json'

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

use([CanvasRenderer, GridComponent, TooltipComponent])

const replaceMergeArr = ref<string[]>()

const option = computed(() => {
  return mergeTheme(props.chartConfig.option, props.themeSetting, includes)
})

const dataSetHandle = (dataset: typeof dataJson) => {
  try {
    dataset && (props.chartConfig.option.series[0].data = dataset)
    vChartRef.value && isPreview() && vChartRef.value.setOption(props.chartConfig.option)
  } catch (error) {
    console.log(error)
  }
}

// dataset 无法变更条数的补丁
watch(
  () => props.chartConfig.option.dataset,
  newData => {
    dataSetHandle(newData)
  },
  {
    deep: false
  }
)

const { vChartRef } = useChartDataFetch(props.chartConfig, useChartEditStore, (newData: typeof dataJson) => {
  dataSetHandle(newData)
})
</script>
