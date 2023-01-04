<template>
  <!-- 事件配置 -->
  <n-collapse class="go-mt-3" arrow-placement="right" :default-expanded-names="['1', '2']">
    <n-text depth="3">
      组件 id：
      <n-text>{{ targetData.id }}</n-text>
    </n-text>
    <chart-event-base-handle></chart-event-base-handle>
    <chart-event-advanced-handle></chart-event-advanced-handle>
  </n-collapse>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChartEventAdvancedHandle } from './components/ChartEventAdvancedHandle'
import { ChartEventBaseHandle } from './components/ChartEventBaseHandle'
import { useTargetData } from '../hooks/useTargetData.hook'

const { targetData } = useTargetData()
const showModal = ref(false)
</script>
