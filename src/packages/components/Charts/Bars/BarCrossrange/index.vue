<template>
  <v-chart
    ref="vChartRef"
    :theme="themeColor"
    :option="option"
    :manual-update="isPreview()"
    :update-options="{
      replaceMerge: replaceMergeArr
    }"
    autoresize
  ></v-chart>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, PropType } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { mergeTheme } from '@/packages/public/chart'
import config, { includes, seriesItem } from './config'
import { useChartDataFetch } from '@/hooks'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { isPreview } from '@/utils'
import { DatasetComponent, GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'

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

use([DatasetComponent, CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent])

const replaceMergeArr = ref<string[]>()

const option = computed(() => {
  return mergeTheme(props.chartConfig.option, props.themeSetting, includes)
})

// dataset 无法变更条数的补丁
watch(
  () => props.chartConfig.option.dataset,
  (newData, oldData) => {
    if (newData?.dimensions.length !== oldData?.dimensions.length) {
      const seriesArr = []
      for (let i = 0; i < newData.dimensions.length - 1; i++) {
        seriesArr.push(seriesItem)
      }
      replaceMergeArr.value = ['series']
      props.chartConfig.option.series = seriesArr
      nextTick(() => {
        replaceMergeArr.value = []
      })
    }
  },
  {
    deep: false
  }
)

const { vChartRef } = useChartDataFetch(props.chartConfig, useChartEditStore)
</script>
