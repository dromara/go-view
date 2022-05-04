<template>
  <div class="go-chart-configurations-data" v-if="targetData">
    <setting-item-box name="请求方式" :alone="true">
      <n-select
        v-model:value="targetData.data.requestDataType"
        :options="selectOptions"
      />
    </setting-item-box>

    <n-divider style="margin: 10px 0;"></n-divider>

    <!-- 静态 -->
    <chart-data-static
      v-if="targetData.data.requestDataType === RequestDataTypeEnum.STATIC"
    ></chart-data-static>

    <!-- 动态 -->
    <chart-data-ajax v-else></chart-data-ajax>
  </div>
</template>

<script setup lang="ts">
import { SettingItemBox } from '@/components/Pages/ChartItemSetting'
import { useTargetData } from '../hooks/useTargetData.hook'
import { ChartDataStatic } from './components/ChartDataStatic/index'
import { ChartDataAjax } from './components/ChartDataAjax/index'
import { SelectCreateDataType, SelectCreateDataEnum } from './index.d'
import { RequestDataTypeEnum } from '@/enums/httpEnum'

const { targetData } = useTargetData()

// 选项
const selectOptions: SelectCreateDataType[] = [
  {
    label: SelectCreateDataEnum.STATIC,
    value: RequestDataTypeEnum.STATIC
  },
  {
    label: SelectCreateDataEnum.AJAX,
    value: RequestDataTypeEnum.AJAX
  }
]
</script>

<style></style>
<style lang="scss" scoped>
@include go('chart-configurations-data') {
}
</style>
