<template>
  <collapse-item name="信息" :expanded="true">
    <setting-item-box name="文字" :alone="true">
      <setting-item>
        <n-input v-model:value="optionData.dataset" size="small"></n-input>
      </setting-item>
    </setting-item-box>
  </collapse-item>

  <collapse-item name="样式" :expanded="true">
    <setting-item-box name="文字">
      <setting-item name="字体大小">
        <n-input-number v-model:value="optionData.fontSize" size="small" placeholder="字体大小"></n-input-number>
      </setting-item>

      <setting-item name="文本方向">
        <n-select v-model:value="optionData.writingMode" size="small" :options="verticalOptions" />
      </setting-item>
      
      <setting-item name="X轴内边距">
        <n-input-number v-model:value="optionData.paddingX" size="small" placeholder="输入内边距"></n-input-number>
      </setting-item>
      <setting-item name="Y轴内边距">
        <n-input-number v-model:value="optionData.paddingY" size="small" placeholder="输入内边距"></n-input-number>
      </setting-item>
      <setting-item name="字间距">
        <n-input-number v-model:value="optionData.letterSpacing" size="small" placeholder="输入字间距"></n-input-number>
      </setting-item>
      <setting-item name="颜色">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.fontColor"></n-color-picker>
      </setting-item>
    </setting-item-box>

    <setting-item-box name="边框">
      <setting-item name="宽度">
        <n-input-number
          v-model:value="optionData.borderWidth"
          size="small"
          :min="0"
          placeholder="宽度"
        ></n-input-number>
      </setting-item>
      <setting-item name="颜色">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.borderColor"></n-color-picker>
      </setting-item>
      <setting-item name="圆角">
        <n-input-number
          v-model:value="optionData.borderRadius"
          size="small"
          :min="0"
          placeholder="圆角"
        ></n-input-number>
      </setting-item>
    </setting-item-box>
    
    <setting-item-box name="背景" :alone="true">
      <setting-item name="背景颜色">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.backgroundColor"></n-color-picker>
      </setting-item>
    </setting-item-box>
  </collapse-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { option, WritingModeEnum, WritingModeObject } from './config'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const verticalOptions = [{
  label: WritingModeEnum.HORIZONTAL,
  value: WritingModeObject[WritingModeEnum.HORIZONTAL]
}, {
  label: WritingModeEnum.VERTICAL,
  value: WritingModeObject[WritingModeEnum.VERTICAL]
}]
</script>
