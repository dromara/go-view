<template>
  <div class="go-chart-theme-color">
    <n-card
      v-for="(value, key) in chartColors"
      :key="key"
      class="card-box"
      :class="{ selected: key === selectName }"
      size="small"
      hoverable
      embedded
      @click="selectTheme(key)"
    >
      <div class="go-flex-items-center">
        <n-text>{{ chartColorsName[key] }}</n-text>
        <span
          class="theme-color-item"
          v-for="colorItem in fetchShowColors(value.color)"
          :key="colorItem"
          :style="{ backgroundColor: colorItem }"
       ></span>
      </div>
      <div
        class="theme-bottom"
        :style="{ backgroundImage: chartColorsshow[key] }"
      ></div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditCanvasConfigEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import {
  chartColors,
  chartColorsName,
  chartColorsshow,
  ChartColorsNameType
} from '@/settings/chartThemes/index'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import cloneDeep from 'lodash/cloneDeep'
import { icon } from '@/plugins'

const { SquareIcon } = icon.ionicons5
const chartEditStore = useChartEditStore()

// 全局颜色
const designStore = useDesignStore()

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme
})

// 选中名称
const selectName = computed(() => {
  return chartEditStore.getEditCanvasConfig.chartThemeColor
})

// 获取用来展示的色号
const fetchShowColors = (colors: Array<string>) => {
  return cloneDeep(colors).splice(0, 6)
}

// 设置主体色（在 ContentEdit > List 中进行注入）
const selectTheme = (theme: ChartColorsNameType) => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.CHART_THEME_COLOR, theme)
}
</script>

<style lang="scss" scoped>
@include go(chart-theme-color) {
  padding-top: 20px;
  .card-box {
    cursor: pointer;
    margin-top: 15px;
    padding: 0;
    @include fetch-bg-color('background-color4-shallow');
    border-radius: 23px;
    overflow: hidden;
    @include deep() {
      .n-card__content {
        padding-top: 5px;
        padding-bottom: 10px;
      }
    }
    &.selected {
      border: 1px solid v-bind('themeColor');
      border-bottom: 1px solid rgba(0, 0, 0, 0);
    }
    &:first-child {
      margin-top: 0;
    }
    .go-flex-items-center {
      justify-content: space-between;
    }
    .theme-color-item {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
    .theme-bottom {
      position: absolute;
      left: 0;
      bottom: 0px;
      width: 100%;
      height: 3px;
      background-image: linear-gradient(to right, #e0c3fc 0%, #8ec5fc 100%);
    }
  }
}
</style>
