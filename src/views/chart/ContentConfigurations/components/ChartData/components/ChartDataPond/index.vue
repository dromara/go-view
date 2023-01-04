<template>
  <!-- 选中内容 -->
  <div class="go-chart-data-pond">
    <n-card class="n-card-shallow">
      <setting-item-box name="请求名称" :alone="true">
        <n-input size="small" :placeholder="pondData?.dataPondName || '暂无'" :disabled="true">
          <template #prefix>
            <n-icon :component="FishIcon" />
          </template>
        </n-input>
      </setting-item-box>

      <setting-item-box name="接口地址" :alone="true">
        <n-input size="small" :placeholder="pondData?.dataPondRequestConfig.requestUrl || '暂无'" :disabled="true">
          <template #prefix>
            <n-icon :component="FlashIcon" />
          </template>
        </n-input>
      </setting-item-box>

      <div class="edit-text" @click="controlModelHandle">
        <div class="go-absolute-center">
          <n-button type="primary" secondary>编辑配置</n-button>
        </div>
      </div>
    </n-card>
  </div>

  <setting-item-box :alone="true">
    <template #name>
      测试
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon size="21" :depth="3">
            <help-outline-icon></help-outline-icon>
          </n-icon>
        </template>
        默认赋值给 dataset 字段
      </n-tooltip>
    </template>
    <n-button type="primary" ghost @click="sendHandle">
      <template #icon>
        <n-icon>
          <flash-icon />
        </n-icon>
      </template>
      发送请求
    </n-button>
  </setting-item-box>

  <!-- 底部数据展示 -->
  <chart-data-matching-and-show :show="showMatching && !loading" :ajax="true"></chart-data-matching-and-show>

  <!-- 骨架图 -->
  <go-skeleton :load="loading" :repeat="3"></go-skeleton>

  <!-- 编辑 / 新增弹窗 -->
  <chart-data-pond-control v-model:modelShow="controlModel" @sendHandle="sendHandle"></chart-data-pond-control>
</template>

<script setup lang="ts">
import { ref, toRefs, toRaw, onBeforeUnmount, computed, watchEffect } from 'vue'
import { icon } from '@/plugins'
import { http, customizeHttp } from '@/api/http'
import { SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { ChartDataPondControl } from './components/ChartDataPondControl'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { useTargetData } from '../../../hooks/useTargetData.hook'
import { ChartDataMatchingAndShow } from '../ChartDataMatchingAndShow'
import { newFunctionHandle } from '@/utils'

const designStore = useDesignStore()
const { HelpOutlineIcon, FlashIcon, PulseIcon, FishIcon } = icon.ionicons5
const { targetData, chartEditStore } = useTargetData()

const {
  requestDataPond,
  requestInterval: GlobalRequestInterval,
  requestIntervalUnit: GlobalRequestIntervalUnit
} = toRefs(chartEditStore.getRequestGlobalConfig)

const loading = ref(false)
const controlModel = ref(false)
const showMatching = ref(false)

let firstFocus = 0
let lastFilter: any = undefined

// 所选数据池
const pondData = computed(() => {
  const selectId = targetData.value.request.requestDataPondId
  if (!selectId) return undefined
  const data = requestDataPond.value.filter(item => {
    return selectId === item.dataPondId
  })
  return data[0]
})

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme
})

// 请求配置 model
const controlModelHandle = () => {
  controlModel.value = true
}

// 发送请求
const sendHandle = async () => {
  if (!targetData.value?.request) {
    window.$message.warning('请选择一个公共接口！')
    return
  }
  loading.value = true
  try {
    // const res = await customizeHttp(
    //   toRaw(pondData.value?.dataPondRequestConfig),
    //   toRaw(chartEditStore.getRequestGlobalConfig)
    // )
    const res = await customizeHttp(toRaw(targetData.value.request), toRaw(chartEditStore.getRequestGlobalConfig))
    loading.value = false
    if (res) {
      if (!res?.data && !targetData.value.filter) window['$message'].warning('您的数据不符合默认格式，请配置过滤器！')
      targetData.value.option.dataset = newFunctionHandle(res?.data, res, targetData.value.filter)
      showMatching.value = true
      return
    }
    window['$message'].warning('数据异常，请检查参数！')
  } catch (error) {
    loading.value = false
    window['$message'].warning('数据异常，请检查参数！')
  }
}

watchEffect(() => {
  const filter = targetData.value?.filter
  if (lastFilter !== filter && firstFocus) {
    lastFilter = filter
    sendHandle()
  }
  firstFocus++
})

onBeforeUnmount(() => {
  lastFilter = null
})
</script>

<style scoped lang="scss">
@include go('chart-data-pond') {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  .n-card-shallow {
    &.n-card {
      @extend .go-background-filter;
      @include deep() {
        .n-card__content {
          padding: 10px;
        }
      }
    }
    .edit-text {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 325px;
      height: 136px;
      cursor: pointer;
      opacity: 0;
      transition: all 0.3s;
      @extend .go-background-filter;
      backdrop-filter: blur(2px) !important;
    }
    &:hover {
      border-color: v-bind('themeColor');
      .edit-text {
        opacity: 1;
      }
    }
  }
}
</style>
