<template>
  <div class="go-chart-configurations-data-ajax">
    <setting-item-box name="类型" :alone="true">
      <n-select
        v-model:value="targetData.data.requestHttpType"
        :options="selectOptions"
      />
    </setting-item-box>

    <setting-item-box name="源地址:" :alone="true">
      <n-text type="info">{{ requestOriginUrl || '暂无' }}</n-text>
    </setting-item-box>

    <setting-item-box :alone="true">
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
              <n-text type="info"> {{item.value}} </n-text>
            </li>
          </ul>
        </n-tooltip>
      </template>
      <n-input
        v-model:value.trim="targetData.data.requestUrl"
        :min="1"
        placeholder="请输入地址（去除源）"
      />
    </setting-item-box>

    <setting-item-box name="测试" :alone="true">
      <n-space>
        <n-button @click="sendHandle">
          <template #icon>
            <n-icon>
              <flash-icon />
            </n-icon>
          </template>
          发送请求
        </n-button>
      </n-space>
    </setting-item-box>

    <go-skeleton :load="loading" :repeat="3"></go-skeleton>

    <chart-data-matching-and-show
      v-show="showMatching && !loading"
      :ajax="true"
    ></chart-data-matching-and-show>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { icon } from '@/plugins'
import { SettingItemBox } from '@/components/Pages/ChartItemSetting'
import { RequestHttpEnum } from '@/enums/httpEnum'
import { chartDataUrl, rankListUrl, numberUrl } from '@/api/mock'
import { http } from '@/api/http'
import { SelectHttpType } from '../../index.d'
import { ChartDataMatchingAndShow } from '../ChartDataMatchingAndShow'
import { useTargetData } from '../../../hooks/useTargetData.hook'
import { isDev } from '@/utils'

const { HelpOutlineIcon, FlashIcon } = icon.ionicons5

const { targetData, chartEditStore } = useTargetData()
const { requestOriginUrl } = toRefs(chartEditStore.getRequestGlobalConfig)
// 是否展示数据分析
const loading = ref(false)
const showMatching = ref(false)

const apiList = [
  {
    value: `【图表】${ chartDataUrl }`
  },
  {
    value: `【表格】${ rankListUrl }`
  },
  {
    value: `【0~1数字】${ numberUrl }`
  }
]

// 选项
const selectOptions: SelectHttpType[] = [
  {
    label: RequestHttpEnum.GET,
    value: RequestHttpEnum.GET,
  },
  {
    label: RequestHttpEnum.POST,
    value: RequestHttpEnum.POST,
  },
]

// 发送请求
const sendHandle = async () => {
  loading.value = true
  const { requestUrl, requestHttpType } = targetData.value.data
  if (!requestUrl) {
    window['$message'].warning('请求参数不正确，请检查！')
    return
  }
  const completePath = requestOriginUrl && requestOriginUrl.value + requestUrl
  const res = await http(requestHttpType)(completePath || '', {})
  setTimeout(() => {
    loading.value = false
    if (res.status === 200) {
      // @ts-ignore
      targetData.value.option.dataset = res.data
      showMatching.value = true
      return
    }
    window['$message'].warning('数据异常，请检查接口数据！')
  }, 500)
}
</script>

<style lang="scss" scoped>
@include go('chart-configurations-data-ajax') {
}
</style>
