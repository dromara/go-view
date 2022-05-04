<template>
  <CollapseItem name="列表" :expanded="true">
    <SettingItemBox name="基础">
      <SettingItem name="表行数">
        <n-input-number
          v-model:value="optionData.rowNum"
          :min="1"
          size="small"
          placeholder="请输入自动计算"
        ></n-input-number>
      </SettingItem>
      <SettingItem name="轮播时间(s)">
        <n-input-number
          v-model:value="optionData.waitTime"
          :min="1"
          size="small"
          placeholder="请输入轮播时间"
        ></n-input-number>
      </SettingItem>
      <SettingItem name="数值单位">
        <n-input
          v-model:value="optionData.unit"
          size="small"
          placeholder="数值单位"
        ></n-input>
      </SettingItem>
    </SettingItemBox>

    <SettingItemBox name="样式">
      <SettingItem name="主体颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="数据颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.textColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="底部线条">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.borderColor"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem,
} from '@/components/Pages/ChartItemSetting'
import { option } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
})
</script>
