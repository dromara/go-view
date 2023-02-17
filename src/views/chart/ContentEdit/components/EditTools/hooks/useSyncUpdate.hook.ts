import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useSync } from '@/views/chart/hooks/useSync.hook'
import { ChartEnum } from '@/enums/pageEnum'
import { SavePageEnum } from '@/enums/editPageEnum'
import { editToJsonInterval } from '@/settings/designSetting'

const { updateComponent } = useSync()
const chartEditStore = useChartEditStore()

// 侦听器更新
const useSyncUpdateHandle = () => {
  // 定义侦听器变量
  let timer: any
  const updateFn = (e: any) => updateComponent(e!.detail, true, false)
  const syncData = async () => {
    dispatchEvent(new CustomEvent(SavePageEnum.CHART, { detail: chartEditStore.getStorageInfo }))
  }

  // 开启侦听
  const use = () => {
    // // 1、定时同步数据
    // timer = setInterval(() => {
    //   // 窗口激活并且处于工作台
    //   document.hasFocus() && syncData()
    // }, editToJsonInterval)
    // 2、失焦同步数据
    addEventListener('blur', syncData)

    // 【监听JSON代码 刷新工作台图表】
    addEventListener(SavePageEnum.JSON, updateFn)
  }

  // 关闭侦听
  const unUse = () => {
    // clearInterval(timer)
    removeEventListener(SavePageEnum.JSON, updateFn)
    removeEventListener('blur', syncData)
  }

  // 路由变更时处理
  const watchHandler = (toName: any, fromName: any) => {
    if (fromName == ChartEnum.CHART_HOME_NAME) {
      unUse()
    }
    if (toName == ChartEnum.CHART_HOME_NAME) {
      use()
    }
  }
  
  return watchHandler
}

export const useSyncUpdate = () => {
  const routerParamsInfo = useRoute()
  watch(() => routerParamsInfo.name, useSyncUpdateHandle(), { immediate: true })
}