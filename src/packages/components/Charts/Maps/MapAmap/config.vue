<template>
  <collapse-item name="基础" :expanded="true">
    <setting-item-box name="语言类型" :alone="true">
      <setting-item>
        <n-select size="small" v-model:value="optionData.mapOptions.lang" :options="langOptions" />
      </setting-item>
    </setting-item-box>
    <setting-item-box name="Key" :alone="true">
      <setting-item name="请务必使用自己的高德应用 key">
        <n-input v-model:value="optionData.mapOptions.amapKey" size="small"></n-input>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="自定义地图样式ID" :alone="true">
      <setting-item>
        <n-input size="small" v-model:value="optionData.mapOptions.amapStyleKeyCustom" />
      </setting-item>
    </setting-item-box>
  </collapse-item>
  <collapse-item name="地图" :expanded="true">
    <setting-item-box name="主题">
      <setting-item>
        <n-select size="small" v-model:value="optionData.mapOptions.amapStyleKey" :options="themeOptions" />
      </setting-item>
    </setting-item-box>
    <setting-item-box name="内容" :alone="true">
      <n-checkbox-group v-model:value="optionData.mapOptions.features">
        <n-space item-style="display: flex;">
          <n-checkbox :value="item.value" :label="item.label" v-for="(item, index) in featuresOptions" :key="index" />
        </n-space>
      </n-checkbox-group>
    </setting-item-box>
    <setting-item-box name="位置">
      <setting-item name="经度">
        <n-input-number v-model:value="optionData.mapOptions.amapLon" :show-button="false" size="small">
          <template #suffix>°</template>
        </n-input-number>
      </setting-item>
      <setting-item name="纬度">
        <n-input-number v-model:value="optionData.mapOptions.amapLat" :show-button="false" size="small">
          <template #suffix>°</template>
        </n-input-number>
      </setting-item>
      <setting-item name="初始缩放">
        <n-input-number v-model:value="optionData.mapOptions.amapZindex" :min="0" size="small"></n-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="模式" :alone="true">
      <setting-item>
        <n-radio-group v-model:value="optionData.mapOptions.viewMode" name="radiogroup">
          <n-space>
            <n-radio v-for="song in viewModeOptions" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </setting-item>
    </setting-item-box>
    <template v-if="optionData.mapOptions.viewMode === '3D'">
      <setting-item-box>
        <setting-item name="天空色">
          <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.mapOptions.skyColor"></n-color-picker>
        </setting-item>
        <setting-item name="俯仰角">
          <n-input-number v-model:value="optionData.mapOptions.pitch" :min="0" :max="83" size="small"></n-input-number>
        </setting-item>
      </setting-item-box>
    </template>
  </collapse-item>
  <collapse-item name="标记" :expanded="true">
    <setting-item-box name="样式">
      <setting-item name="类型">
        <n-select size="small" v-model:value="optionData.mapOptions.mapMarkerType" :options="MarkerOptions" />
      </setting-item>
      <setting-item name="颜色">
        <n-color-picker v-model:value="optionData.mapOptions.marker.fillColor" size="small"></n-color-picker>
      </setting-item>
    </setting-item-box>
  </collapse-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { option, MarkerEnum, ThemeEnum, LangEnum, ViewModeEnum, FeaturesEnum } from './config'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'

defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const themeOptions = [
  {
    value: ThemeEnum.NORMAL,
    label: '标准'
  },
  {
    value: ThemeEnum.DARK,
    label: '幻影黑'
  },
  {
    value: ThemeEnum.LIGHT,
    label: '月光银'
  },
  {
    value: ThemeEnum.WHITES_MOKE,
    label: '远山黛'
  },
  {
    value: ThemeEnum.FRESH,
    label: '草色青'
  },
  {
    value: ThemeEnum.GREY,
    label: '雅士灰'
  },
  {
    value: ThemeEnum.GRAFFITI,
    label: '涂鸦'
  },
  {
    value: ThemeEnum.MACARON,
    label: '马卡龙'
  },
  {
    value: ThemeEnum.BLUE,
    label: '靛青蓝'
  },
  {
    value: ThemeEnum.DARKBLUE,
    label: '极夜蓝'
  },
  {
    value: ThemeEnum.WINE,
    label: '酱籽'
  }
]

const langOptions = [
  {
    value: LangEnum.ZH_CN,
    label: '中文简体'
  },
  {
    value: LangEnum.EN,
    label: '英文'
  },
  {
    value: LangEnum.ZH_EN,
    label: '中英文对照'
  }
]

const viewModeOptions = [
  {
    value: ViewModeEnum.PLANE,
    label: '2D'
  },
  {
    value: ViewModeEnum.STEREOSCOPIC,
    label: '3D'
  }
]

const featuresOptions = [
  {
    value: FeaturesEnum.BG,
    label: '显示地图背景'
  },
  {
    value: FeaturesEnum.POINT,
    label: '显示标识'
  },
  {
    value: FeaturesEnum.ROAD,
    label: '显示道路'
  },
  {
    value: FeaturesEnum.BUILDING,
    label: '显示建筑'
  }
]

const MarkerOptions = [
  {
    value: MarkerEnum.CIRCLE_MARKER,
    label: '圆形标点'
  },
  {
    value: MarkerEnum.MARKER,
    label: '定位标点'
  },
  {
    value: MarkerEnum.NONE,
    label: '隐藏标点'
  }
]
</script>
