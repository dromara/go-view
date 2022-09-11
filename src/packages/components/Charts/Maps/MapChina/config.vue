<template>
  <!-- Echarts 全局设置 -->
  <div>
    <global-setting :optionData="optionData" :in-chart="true"></global-setting>
    <CollapseItem name="地图" :expanded="true">
      <SettingItemBox name="省份" :alone="true">
        <SettingItem name="背景颜色">
          <n-color-picker
            size="small"
            :modes="['hex']"
            v-model:value="seriesList[1].itemStyle.areaColor"
          ></n-color-picker>
        </SettingItem>
        <SettingItem name="聚焦颜色（预览可见）">
          <n-color-picker
            size="small"
            :modes="['hex']"
            v-model:value="seriesList[1].itemStyle.emphasis.areaColor"
          ></n-color-picker>
        </SettingItem>
        <SettingItem name="聚焦阴影（预览可见）">
          <n-color-picker
            size="small"
            :modes="['hex']"
            v-model:value="seriesList[1].itemStyle.emphasis.shadowColor"
          ></n-color-picker>
        </SettingItem>
      </SettingItemBox>
      <SettingItemBox name="边框">
        <SettingItem name="颜色">
          <n-color-picker
            size="small"
            :modes="['hex']"
            v-model:value="seriesList[1].itemStyle.borderColor"
          ></n-color-picker>
        </SettingItem>
        <SettingItem name="大小">
          <n-input-number
            v-model:value="seriesList[1].itemStyle.borderWidth"
            :min="1"
            size="small"
            placeholder="请输入边框大小"
          ></n-input-number>
        </SettingItem>
      </SettingItemBox>
      <SettingItemBox name="其他">
        <SettingItem>
          <n-checkbox v-model:checked="seriesList[1].itemStyle.showHainanIsLands" size="small">显示南海群岛</n-checkbox>
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>
    <CollapseItem name="标记" :expanded="true">
      <SettingItemBox name="样式">
        <SettingItem name="大小">
          <n-input-number v-model:value="seriesList[0].symbolSize" size="small" :min="0"></n-input-number>
        </SettingItem>
        <SettingItem name="颜色">
          <n-color-picker size="small" :modes="['hex']" v-model:value="seriesList[0].itemStyle.color"></n-color-picker>
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { lineConf } from '@/packages/chartConfiguration/echarts/index'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import { GlobalSetting } from '@/components/Pages/ChartItemSetting'

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
