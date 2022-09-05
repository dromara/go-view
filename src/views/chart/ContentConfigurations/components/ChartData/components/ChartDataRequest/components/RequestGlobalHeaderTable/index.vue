<template>
  <div>
    <n-tabs type="line" animated v-model:value="tabValue">
      <n-tab v-for="item in tabs" :key="item" :name="item" :tab="item"> {{ item }} </n-tab>
    </n-tabs>
    <div class="go-mt-3">
      <!-- 这里的 v-if 是为了处理打包 ts 错类型误 -->
      <request-header-table
        v-if="tabValue === RequestParamsTypeEnum.HEADER"
        :editDisabled="editDisabled"
        :target="requestParams[tabValue]"
        @update="updateRequestParams"
      ></request-header-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useTargetData } from '@/views/chart/ContentConfigurations/components/hooks/useTargetData.hook'
import { RequestHeaderTable } from '../RequestHeaderTable'
import { RequestParamsTypeEnum, RequestParamsObjType } from '@/enums/httpEnum'

defineProps({
  editDisabled: {
    type: Boolean,
    default: true
  }
})

const { chartEditStore } = useTargetData()
const { requestParams } = toRefs(chartEditStore.getRequestGlobalConfig)

const tabValue = ref<RequestParamsTypeEnum>(RequestParamsTypeEnum.HEADER)
const tabs = [RequestParamsTypeEnum.HEADER]

// 更新表格参数
const updateRequestParams = (paramsObj: RequestParamsObjType) => {
  if (tabValue.value === RequestParamsTypeEnum.HEADER) {
    requestParams.value[tabValue.value] = paramsObj
  }
}
</script>

<style lang="scss" scoped></style>
