<template>
  <n-progress
    :type="type"
    :height="h"
    :processing="processing"
    :percentage="option.dataset"
    :indicator-placement="indicatorPlacement"
    :color="color"
    :rail-color="railColor"
    :offset-degree="offsetDegree"
  >
    <n-text
      :style="{
        color: indicatorTextColor,
        fontSize: `${indicatorTextSize}px`
      }"
    >
      {{ option.dataset }} {{ unit }}
    </n-text>
  </n-progress>
</template>

<script setup lang="ts">
import { PropType, toRefs, watch, shallowReactive } from 'vue'
import { useChartDataFetch } from '@/hooks'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import config, { option as configOption } from './config'
import { toNumber } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<config>,
    required: true
  }
})

// 取配置数据
const { w, h } = toRefs(props.chartConfig.attr)
const {
  type,
  unit,
  color,
  processing,
  railColor,
  indicatorTextColor,
  indicatorPlacement,
  indicatorTextSize,
  offsetDegree,
  dataset
} = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: configOption.dataset
})

// 手动更新
watch(
  () => props.chartConfig.option.dataset,
  (newData: any) => {
    option.dataset = toNumber(newData, 2)
  },
  {
    deep: false
  }
)
// 预览更新
useChartDataFetch(props.chartConfig, useChartEditStore, (newData: number) => {
  option.dataset = toNumber(newData, 2)
})
</script>
