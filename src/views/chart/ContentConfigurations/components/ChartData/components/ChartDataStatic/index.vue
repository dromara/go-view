<template>
  <div class="go-chart-configurations-data-static">
    <chart-data-matching-and-show :ajax="false"></chart-data-matching-and-show>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { ChartDataMatchingAndShow } from '../ChartDataMatchingAndShow'
</script>

<style lang="scss" scoped>
@include go('chart-configurations-data-static') {
}
</style>
