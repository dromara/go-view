<template>
  <sketch-rule
    :thick="thick"
    :scale="scale"
    :width="width"
    :height="height"
    :startX="startX"
    :startY="startY"
    :lines="lines"
  ></sketch-rule>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useDesignStore } from '@/store/modules/designStore/designStore'

const chartEditStore = useChartEditStore()
const designStore = useDesignStore()
const themeColor = ref(designStore.getAppTheme)

const { width, height } = toRefs(chartEditStore.getEditCanvasConfig)

// 初始化标尺的缩放
const scale = 1
// x轴标尺开始的坐标数值
const startX = 20
// y轴标尺开始的坐标数值
const startY = 20
// 标尺的厚度
const thick = 20
// 初始化水平标尺上的参考线
const lines = {
  h: [],
  v: []
}
</script>

<style>

/* 使用 SCSS 会报错，直接使用最基础的 CSS 进行修改，
此库有计划 Vue3 版本，但是开发的时候还没发布 */

#mb-ruler {
  top: 0; 
  left: 0;
}

/* 横线 */
#mb-ruler .v-container .lines .line {
  /* 最大缩放 200% */
  width: 200vw!important;
  border-top: 1px dashed v-bind('themeColor') !important;
  
}
#mb-ruler .v-container .indicator {
  border-bottom: 1px dashed v-bind('themeColor') !important;
}
/* 竖线 */
#mb-ruler .h-container .lines .line {
  /* 最大缩放 200% */
  height: 200vh!important;
  border-left: 1px dashed v-bind('themeColor') !important;
}
#mb-ruler .h-container .indicator {
  border-left: 1px dashed v-bind('themeColor') !important;
}
/* 坐标数值背景颜色 */
#mb-ruler .indicator .value {
  background-color: rgba(0, 0, 0, 0);
}
/* 删除按钮 */
#mb-ruler .line .del {
  padding: 0;
  color: v-bind('themeColor');
  font-size: 26px;
  font-weight: bolder;
}

#mb-ruler .corner{
  border-width: 0!important;
}
</style>
