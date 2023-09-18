<template>
  <n-space>
    <n-card v-if="barOption" class="go-mt-3" :bordered="false" role="dialog" size="small" aria-modal="true">
      <n-tabs type="segment" size="small" animated>
        <n-tab-pane name="柱状图" tab="柱状图">
          <v-chart
            ref="vChartRefBar"
            :theme="{ color }"
            :option="barOption"
            :manual-update="true"
            autoresize
            :style="chartStyle"
          ></v-chart>
        </n-tab-pane>
        <n-tab-pane name="折线图" tab="折线图">
          <v-chart
            ref="vChartRefLine"
            :theme="{ color }"
            :option="lineOption"
            :manual-update="true"
            autoresize
            :style="chartStyle"
          ></v-chart>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import { ref, watch, PropType } from 'vue'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { use } from 'echarts/core'
import { DatasetComponent, GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { option as barOptions } from './barOptions'
import { option as lineOptions } from './lineOptions'

const props = defineProps({
  color: {
    type: Array as PropType<string[]>,
    required: true
  }
})
use([DatasetComponent, CanvasRenderer, BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent])

const barOption = ref()
const lineOption = ref()

const chartStyle = {
  width: '528px',
  height: '200px'
}

watch(
  () => props.color,
  (newData: string[]) => {
    barOption.value = barOptions(newData)
    lineOption.value = lineOptions(newData)
  },
  {
    immediate: true,
    deep: true
  }
)
</script>