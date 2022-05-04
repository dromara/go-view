<template>
  <div class="go-packages-image">
    <div :style="getStyle(borderRadius)">
      <n-image
        :object-fit="fit"
        preview-disabled
        :src="dataset"
        :fallback-src="requireErrorImg()"
        :width="w"
        :height="h"
      ></n-image>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, toRefs } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { requireErrorImg } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true,
  },
})

const { w, h } = toRefs(props.chartConfig.attr)
const { dataset, fit, borderRadius } = toRefs(props.chartConfig.option)

const getStyle = (radius: number) => {
  return {
    borderRadius: `${radius}px`,
    overflow: 'hidden',
  }
}
</script>

<style lang="scss" scoped>
.go-packages-image {
}
</style>