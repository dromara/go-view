<template>
  <CollapseItem
    v-for="(item, index) in seriesList"
    :key="index"
    :name="`折线图-${index + 1}`"
    :expanded="true"
  >
    <SettingItemBox name="线条">
      <SettingItem name="宽度">
        <n-input-number
          v-model:value="item.lineStyle.width"
          :min="1"
          :max="100"
          size="small"
          placeholder="自动计算"
       ></n-input-number>
      </SettingItem>
      <SettingItem name="类型">
        <n-select
          v-model:value="item.lineStyle.type"
          size="small"
          :options="lineConf.lineStyle.type"
       ></n-select>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
  <!-- Echarts 全局设置 -->
  <global-setting :optionData="optionData" :in-chart="true"></global-setting>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { lineConf } from '@/packages/chartConfiguration/echarts/index'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import {
  GlobalSetting,
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true
  }
})

const seriesList = computed(() => {
  return props.optionData.series
})
</script>
