<template>
  <collapse-item :name="isCanvas ? '滤镜' : '滤镜 / 变换'">
    <setting-item-box name="色相" :alone="true">
      <setting-item :name="`值：${chartStyles.hueRotate}deg`">
        <!-- 透明度 -->
        <n-slider
          v-model:value="chartStyles.hueRotate"
          :step="3"
          :min="0"
          :max="360"
          :format-tooltip="degFormatTooltip"
        ></n-slider>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="饱和度" :alone="true">
      <setting-item
        :name="`值：${(parseFloat(String(chartStyles.saturate)) * 100).toFixed(0)}%`"
      >
        <!-- 透明度 -->
        <n-slider
          v-model:value="chartStyles.saturate"
          :step="0.1"
          :min="0"
          :max="2"
          :format-tooltip="sliderFormatTooltip"
        ></n-slider>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="对比度" :alone="true">
      <setting-item
        :name="`值：${(parseFloat(String(chartStyles.contrast)) * 100).toFixed(0)}%`"
      >
        <!-- 透明度 -->
        <n-slider
          v-model:value="chartStyles.contrast"
          :step="0.1"
          :min="0"
          :max="2"
          :format-tooltip="sliderFormatTooltip"
        ></n-slider>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="亮度" :alone="true">
      <setting-item
        :name="`值：${(parseFloat(String(chartStyles.brightness)) * 100).toFixed(0)}%`"
      >
        <!-- 透明度 -->
        <n-slider
          v-model:value="chartStyles.brightness"
          :step="0.1"
          :min="0"
          :max="2"
          :format-tooltip="sliderFormatTooltip"
        ></n-slider>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="透明度" :alone="true">
      <setting-item
        :name="`值：${(parseFloat(String(chartStyles.opacity)) * 100).toFixed(0)}%`"
      >
        <!-- 透明度 -->
        <n-slider
          v-model:value="chartStyles.opacity"
          :step="0.1"
          :min="0"
          :max="1"
          :format-tooltip="sliderFormatTooltip"
        ></n-slider>
      </setting-item>
    </setting-item-box>
    
    <!-- 变换 -->
    <setting-item-box v-if="!isCanvas" name="旋转°">
      <setting-item name="Z轴(平面) - 旋转">
        <!-- 透明度 -->
        <n-input-number
          v-model:value="chartStyles.rotateZ"
          :min="0"
          :max="360"
          size="small"
          placeholder="角度"
        ></n-input-number>
      </setting-item>
      <setting-item name="X轴 - 旋转">
        <!-- 透明度 -->
        <n-input-number
          v-model:value="chartStyles.rotateX"
          :min="0"
          :max="360"
          size="small"
          placeholder="角度"
        ></n-input-number>
      </setting-item>
      <setting-item name="Y轴 - 旋转">
        <!-- 透明度 -->
        <n-input-number
          v-model:value="chartStyles.rotateY"
          :min="0"
          :max="360"
          size="small"
          placeholder="角度"
        ></n-input-number>
      </setting-item>
    </setting-item-box>

    <!-- 倾斜 -->
    <setting-item-box v-if="!isCanvas" name="倾斜°">
      <setting-item name="X轴 - 倾斜">
        <n-input-number
          v-model:value="chartStyles.skewX"
          :min="0"
          :max="360"
          size="small"
          placeholder="角度"
        ></n-input-number>
      </setting-item>
      <setting-item name="Y轴 - 倾斜">
        <n-input-number
          v-model:value="chartStyles.skewY"
          :min="0"
          :max="360"
          size="small"
          placeholder="角度"
        ></n-input-number>
      </setting-item>
    </setting-item-box>
  </collapse-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { PickCreateComponentType } from '@/packages/index.d'
import {
  SettingItemBox,
  SettingItem,
  CollapseItem,
} from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  isCanvas: {
    type: Boolean,
    default: false
  },
  chartStyles: {
    type: Object as PropType<Omit<PickCreateComponentType<'styles'>, 'animations'>>,
    required: true,
  },
})

// 百分比格式化persen
const sliderFormatTooltip = (v: string) => {
  // @ts-ignore
  return `${(parseFloat(v) * 100).toFixed(0)}%`
}
// 角度格式化
const degFormatTooltip = (v: string) => {
  // @ts-ignore
  return `${v}deg`
}
</script>

<style lang="scss" scoped></style>
