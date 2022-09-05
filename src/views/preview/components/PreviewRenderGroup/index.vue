<template>
  <div
    class="chart-item"
    v-for="item in groupData.groupList"
    :class="animationsClass(item.styles.animations)"
    :key="item.id"
    :style="{ 
      ...getComponentAttrStyle(item.attr, groupIndex),
      ...getFilterStyle(item.styles),
      ...getTransformStyle(item.styles)
    }"
  >
    <component
      :is="item.chartConfig.chartKey"
      :chartConfig="item"
      :themeSetting="themeSetting"
      :themeColor="themeColor"
      :style="{...getSizeStyle(item.attr)}"
    ></component>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { CreateComponentGroupType } from '@/packages/index.d'
import { animationsClass, getFilterStyle, getTransformStyle } from '@/utils'
import { getSizeStyle, getComponentAttrStyle } from '../../utils'

const props = defineProps({
  groupData: {
    type: Object as PropType<CreateComponentGroupType>,
    required: true
  },
  themeSetting: {
    type: Object,
    required: true
  },
  themeColor: {
    type: Object,
    required: true
  },
  groupIndex: {
    type: Number,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.chart-item {
  position: absolute;
}
</style>
