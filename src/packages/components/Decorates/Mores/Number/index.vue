<template>
  <n-statistic tabular-nums class="go-decorates-number">
    <template #prefix>
      <span :style="`color:${prefixColor};font-size:${numberSize}px`">
        {{ prefixText }}
      </span>
    </template>
    <span :style="`color:${numberColor};font-size:${numberSize}px`">
      <n-number-animation
        :from="from"
        :to="to"
        :duration="dur * 1000"
        :show-separator="showSeparator"
      ></n-number-animation>
    </span>
    <template #suffix>
      <span :style="`color:${suffixColor};font-size:${numberSize}px`">
        {{ suffixText }}
      </span>
    </template>
  </n-statistic>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { CreateComponentType } from '@/packages/index.d'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true,
  },
})

const { w, h } = toRefs(props.chartConfig.attr)
const {
  dur,
  showSeparator,
  prefixText,
  prefixColor,
  suffixText,
  suffixColor,
  from,
  to,
  numberSize,
  numberColor,
} = toRefs(props.chartConfig.option)
</script>
<style lang="scss" scoped>
@include go('decorates-number') {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
