<template>
  <div
    :class="animationsClass(groupData.styles.animations)"
    :style="{
      ...getSizeStyle(groupData.attr),
      ...getFilterStyle(groupData.styles),
    }"
  >
    <div
      class="chart-item"
      v-for="item in groupData.groupList"
      :class="animationsClass(item.styles.animations)"
      :key="item.id"
      :style="{
      ...getComponentAttrStyle(item.attr, groupIndex),
      ...getStatusStyle(item.status),
      ...getPreviewConfigStyle(item.preview),
      ...getBlendModeStyle(item.styles) as any
    }"
    >
      <component
        :is="item.chartConfig.chartKey"
        :id="item.id"
        :chartConfig="item"
        :themeSetting="themeSetting"
        :themeColor="themeColor"
        :style="{
          ...getSizeStyle(item.attr),
          ...getFilterStyle(item.styles),
          ...getTransformStyle(item.styles)
        }"
        v-on="useLifeHandler(item)"
      ></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { CreateComponentGroupType } from '@/packages/index.d'
import { animationsClass, getFilterStyle, getTransformStyle, getBlendModeStyle } from '@/utils'
import { getSizeStyle, getComponentAttrStyle, getStatusStyle, getPreviewConfigStyle } from '../../utils'
import { useLifeHandler } from '@/hooks'

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
