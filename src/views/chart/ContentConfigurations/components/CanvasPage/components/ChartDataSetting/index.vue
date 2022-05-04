<template>
  <div class="go-chart-data-setting">
    <setting-item-box name="源地址" :alone="true">
      <n-input
        v-model:value.trim="chartEditStore.getRequestGlobalConfig.requestOriginUrl"
        placeholder="源地址如: http://127.0.0.1"
      ></n-input>
    </setting-item-box>
    <setting-item-box name="更新间隔">
      <n-input-number
        v-model:value.trim="chartEditStore.getRequestGlobalConfig.requestInterval"
        min="5"
        :show-button="false"
        placeholder="为 0 不更新"
      >
        <template #suffix>
          秒
        </template>
      </n-input-number>
    </setting-item-box>
  </div>
</template>

<script setup lang="ts">
import { SettingItemBox } from '@/components/Pages/ChartItemSetting'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'

const chartEditStore = useChartEditStore()

</script>
