<template>
  <collapse-item v-if="title" name="标题">
    <template #header>
      <n-switch
        v-show="inChart"
        v-model:value="title.show"
        size="small"
      ></n-switch>
    </template>
    <setting-item-box name="标题">
      <setting-item name="颜色">
        <n-color-picker
          v-model:value="title.textStyle.color"
          size="small"
        ></n-color-picker>
      </setting-item>
      <setting-item name="大小">
        <n-input-number
          v-model:value="title.textStyle.fontSize"
          :min="1"
          size="small"
        ></n-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="副标题">
      <setting-item name="颜色">
        <n-color-picker
          size="small"
          v-model:value="title.subtextStyle.color"
        ></n-color-picker>
      </setting-item>
      <setting-item name="大小">
        <n-input-number
          v-model:value="title.subtextStyle.fontSize"
          :min="1"
          size="small"
        ></n-input-number>
      </setting-item>
    </setting-item-box>
  </collapse-item>

  <collapse-item v-if="xAxis" name="X轴">
    <template #header>
      <n-switch
        v-show="inChart"
        v-model:value="xAxis.show"
        size="small"
      ></n-switch>
    </template>
    <setting-item-box name="单位">
      <setting-item name="名称">
        <n-input v-model:value="xAxis.name" size="small"></n-input>
      </setting-item>
      <setting-item name="颜色">
        <n-color-picker
          size="small"
          v-model:value="xAxis.nameTextStyle.color"
        ></n-color-picker>
      </setting-item>
      <setting-item name="大小">
         <n-input-number
          v-model:value="xAxis.nameTextStyle.fontSize"
          :min="12"
          size="small"
        ></n-input-number>
      </setting-item>
      <setting-item name="偏移量">
         <n-input-number
          v-model:value="xAxis.nameGap"
          :min="5"
          size="small"
        ></n-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="标签">
      <setting-item v-show="inChart" name="展示">
        <n-space>
          <n-switch
            v-model:value="xAxis.axisLabel.show"
            size="small"
          ></n-switch>
        </n-space>
      </setting-item>
      <setting-item name="颜色">
        <n-color-picker
          size="small"
          v-model:value="xAxis.axisLabel.color"
        ></n-color-picker>
      </setting-item>
      <setting-item name="大小">
        <n-input-number
          v-model:value="xAxis.axisLabel.fontSize"
          :min="8"
          size="small"
        ></n-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="轴线">
      <setting-item name="颜色">
        <n-color-picker
          v-model:value="xAxis.axisLine.lineStyle.color"
          size="small"
        ></n-color-picker>
      </setting-item>
      <setting-item name="粗细">
        <n-input-number
          v-model:value="xAxis.axisLine.lineStyle.width"
          :min="1"
          size="small"
        ></n-input-number>
      </setting-item>
      <setting-item name="对齐零">
        <n-space>
          <n-switch
            v-model:value="xAxis.axisLine.onZero"
            size="small"
          ></n-switch>
        </n-space>
      </setting-item>
      <setting-item v-show="inChart" name="反向">
        <n-space>
          <n-switch v-model:value="xAxis.inverse" size="small"></n-switch>
        </n-space>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="刻度">
      <setting-item v-show="inChart" name="展示">
        <n-space>
          <n-switch v-model:value="xAxis.axisTick.show" size="small"></n-switch>
        </n-space>
      </setting-item>
      <setting-item name="长度">
        <n-input-number
          v-model:value="xAxis.axisTick.length"
          :min="1"
          size="small"
        ></n-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="分割线">
      <setting-item v-show="inChart" name="展示">
        <n-space>
          <n-switch
            v-model:value="xAxis.splitLine.show"
            size="small"
          ></n-switch>
        </n-space>
      </setting-item>
      <setting-item name="颜色">
        <n-color-picker
          v-model:value="xAxis.splitLine.lineStyle.color"
          size="small"
        ></n-color-picker>
      </setting-item>
      <setting-item name="粗细">
        <n-input-number
          v-model:value="xAxis.splitLine.lineStyle.width"
          :min="1"
          size="small"
        ></n-input-number>
      </setting-item>
      <setting-item name="类型">
        <n-select
          v-model:value="xAxis.splitLine.lineStyle.type"
          size="small"
          :options="axisConfig.splitLint.lineStyle.type"
        ></n-select>
      </setting-item>
      <setting-item name="位置">
        <n-select
          v-model:value="xAxis.position"
          size="small"
          :options="axisConfig.xposition"
        ></n-select>
      </setting-item>
    </setting-item-box>
  </collapse-item>

  <collapse-item v-if="yAxis" name="Y轴">
    <template #header>
      <n-switch
        v-show="inChart"
        v-model:value="yAxis.show"
        size="small"
      ></n-switch>
    </template>
    <setting-item-box name="单位">
      <setting-item name="名称">
        <n-input v-model:value="yAxis.name" size="small"></n-input>
      </setting-item>
      <setting-item name="颜色">
        <n-color-picker
          size="small"
          v-model:value="yAxis.nameTextStyle.color"
        ></n-color-picker>
      </setting-item>
       <setting-item name="大小">
        <n-input-number
          v-model:value="yAxis.nameTextStyle.fontSize"
          :min="8"
          size="small"
        ></n-input-number>
      </setting-item>
      <setting-item name="偏移量">
         <n-input-number
          v-model:value="yAxis.nameGap"
          :min="5"
          size="small"
        ></n-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="标签">
      <setting-item v-show="inChart" name="展示">
        <n-space>
          <n-switch
            v-model:value="yAxis.axisLabel.show"
            size="small"
          ></n-switch>
        </n-space>
      </setting-item>
      <setting-item name="颜色">
        <n-color-picker
          size="small"
          v-model:value="yAxis.axisLabel.color"
        ></n-color-picker>
      </setting-item>
      <setting-item name="大小">
        <n-input-number
          v-model:value="yAxis.axisLabel.fontSize"
          :min="8"
          size="small"
        ></n-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="轴线">
      <setting-item v-show="inChart" name="展示">
        <n-space>
          <n-switch v-model:value="yAxis.axisLine.show" size="small"></n-switch>
        </n-space>
      </setting-item>
      <setting-item name="颜色">
        <n-color-picker
          v-model:value="yAxis.axisLine.lineStyle.color"
          size="small"
        ></n-color-picker>
      </setting-item>
      <setting-item name="粗细">
        <n-input-number
          v-model:value="yAxis.axisLine.lineStyle.width"
          :min="1"
          size="small"
        ></n-input-number>
      </setting-item>
      <setting-item name="对齐零">
        <n-space>
          <n-switch
            v-model:value="yAxis.axisLine.onZero"
            size="small"
          ></n-switch>
        </n-space>
      </setting-item>
      <setting-item v-show="inChart" name="反向">
        <n-space>
          <n-switch v-model:value="yAxis.inverse" size="small"></n-switch>
        </n-space>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="刻度">
      <setting-item v-show="inChart" name="展示">
        <n-space>
          <n-switch v-model:value="yAxis.axisTick.show" size="small"></n-switch>
        </n-space>
      </setting-item>
      <setting-item name="长度">
        <n-input-number
          v-model:value="yAxis.axisTick.length"
          :min="1"
          size="small"
        ></n-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="分割线">
      <setting-item v-show="inChart" name="展示">
        <n-space>
          <n-switch
            v-model:value="yAxis.splitLine.show"
            size="small"
          ></n-switch>
        </n-space>
      </setting-item>
      <setting-item name="颜色">
        <n-color-picker
          v-model:value="yAxis.splitLine.lineStyle.color"
          size="small"
        ></n-color-picker>
      </setting-item>
      <setting-item name="粗细">
        <n-input-number
          v-model:value="yAxis.splitLine.lineStyle.width"
          :min="1"
          size="small"
        ></n-input-number>
      </setting-item>
      <setting-item name="类型">
        <n-select
          v-model:value="yAxis.splitLine.lineStyle.type"
          size="small"
          :options="axisConfig.splitLint.lineStyle.type"
        ></n-select>
      </setting-item>
      <setting-item name="位置">
        <n-select
          v-model:value="yAxis.position"
          size="small"
          :options="axisConfig.yposition"
        ></n-select>
      </setting-item>
    </setting-item-box>
  </collapse-item>

  <collapse-item v-if="legend" name="图例">
    <template #header>
      <n-switch
        v-show="inChart"
        v-model:value="legend.show"
        size="small"
      ></n-switch>
    </template>
    <setting-item-box name="图例文字">
      <setting-item>
        <n-color-picker
          size="small"
          v-model:value="legend.textStyle.color"
        ></n-color-picker>
      </setting-item>
    </setting-item-box>
  </collapse-item>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import { axisConfig } from '@/packages/chartConfiguration/echarts/index'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true
  },
  inChart: {
    type: Boolean,
    required: false,
    default: false
  }
})

const title = computed(() => {
  return props.optionData.title
})

const xAxis = computed(() => {
  return props.optionData.xAxis
})

const yAxis = computed(() => {
  return props.optionData.yAxis
})

const legend = computed(() => {
  return props.optionData.legend
})
</script>
