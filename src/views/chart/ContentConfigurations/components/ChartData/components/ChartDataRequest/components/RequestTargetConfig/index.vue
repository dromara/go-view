<template>
  <!-- 组件配置 -->
  <n-divider class="go-my-3" title-placement="left"></n-divider>
  <setting-item-box
    :itemRightStyle="{
      gridTemplateColumns: '5fr 2fr 1fr'
    }"
  >
    <template #name>
      地址
      <n-tooltip trigger="hover" v-if="isDev()">
        <template #trigger>
          <n-icon size="21" :depth="3">
            <help-outline-icon></help-outline-icon>
          </n-icon>
        </template>
        <ul class="go-pl-0">
          开发环境使用 mock 数据，请输入
          <li v-for="item in apiList" :key="item.value">
            <n-text type="info"> {{ item.value }} </n-text>
          </li>
        </ul>
      </n-tooltip>
    </template>
    <setting-item name="请求方式 & URL 地址">
      <n-input-group>
        <n-select class="select-type-options" v-model:value="requestHttpType" :options="selectTypeOptions" />
        <n-input v-model:value.trim="requestUrl" :min="1" placeholder="请输入地址（去除前置URL）">
          <template #prefix>
            <n-text>{{ requestOriginUrl }}</n-text>
            <n-divider vertical />
          </template>
        </n-input>
      </n-input-group>
      <!-- 组件url -->
    </setting-item>
    <setting-item name="更新间隔，为 0 只会初始化">
      <n-input-group>
        <n-input-number
          v-model:value.trim="requestInterval"
          class="select-time-number"
          min="0"
          :show-button="false"
          placeholder="默认使用全局数据"
        >
        </n-input-number>
        <!-- 单位 -->
        <n-select class="select-time-options" v-model:value="requestIntervalUnit" :options="selectTimeOptions" />
      </n-input-group>
    </setting-item>
  </setting-item-box>
  <setting-item-box name="选择方式" class="go-mt-0">
    <request-header></request-header>
  </setting-item-box>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { useTargetData } from '@/views/chart/ContentConfigurations/components/hooks/useTargetData.hook'
import { selectTypeOptions, selectTimeOptions } from '@/views/chart/ContentConfigurations/components/ChartData/index.d'
import { RequestHeader } from '../RequestHeader'
import { isDev } from '@/utils'
import { icon } from '@/plugins'
import { chartDataUrl, rankListUrl, scrollBoardUrl, numberFloatUrl, numberIntUrl, textUrl, imageUrl } from '@/api/mock'

const { HelpOutlineIcon } = icon.ionicons5
const { targetData, chartEditStore } = useTargetData()
const { requestOriginUrl } = toRefs(chartEditStore.getRequestGlobalConfig)
const { requestInterval, requestIntervalUnit, requestHttpType, requestUrl } = toRefs(targetData.value.request)

const apiList = [
  {
    value: `【图表】${chartDataUrl}`
  },
  {
    value: `【文本】${textUrl}`
  },
  {
    value: `【0~100 整数】${numberIntUrl}`
  },
  {
    value: `【0~1小数】${numberFloatUrl}`
  },
  {
    value: `【图片地址】${imageUrl}`
  },
  {
    value: `【排名列表】${rankListUrl}`
  },
  {
    value: `【滚动表格】${scrollBoardUrl}`
  }
]
</script>

<style lang="scss" scoped>
.select-time-number {
  width: 100%;
}
.select-time-options {
  width: 100px;
}
.select-type-options {
  width: 120px;
}
</style>
