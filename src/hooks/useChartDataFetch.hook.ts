import { ref, toRefs, watchEffect, nextTick } from 'vue'
import type VChart from 'vue-echarts'
import { http } from '@/api/http'
import { CreateComponentType, PackagesCategoryEnum } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { RequestDataTypeEnum } from '@/enums/httpEnum'
import { isPreview } from '@/utils'

// 获取类型
type ChartEditStoreType = typeof useChartEditStore

/**
 * setdata 数据监听与更改
 * @param targetComponent
 * @param useChartEditStore 若直接引会报错，只能动态传递
 * @param updateCallback 自定义更新函数
 */
export const useChartDataFetch = (
  targetComponent: CreateComponentType,
  useChartEditStore: ChartEditStoreType, 
  updateCallback?: (...args: any) => any
) => {
  const vChartRef = ref<typeof VChart | null>(null)
  let fetchInterval: any = 0

  isPreview() &&
    watchEffect(() => {
      clearInterval(fetchInterval)

      const chartEditStore = useChartEditStore()
      const { requestOriginUrl, requestInterval } = toRefs(
        chartEditStore.getRequestGlobalConfig
      )
      const { requestDataType, requestHttpType, requestUrl } = toRefs(
        targetComponent.data
      )
      if (requestDataType.value !== RequestDataTypeEnum.AJAX) return
      // 处理地址
      if (requestUrl?.value && requestInterval.value > 0) {
        // requestOriginUrl 允许为空
        const completePath =
          requestOriginUrl && requestOriginUrl.value + requestUrl.value
        if (!completePath) return

        fetchInterval = setInterval(async () => {
          const res:any = await http(requestHttpType.value)(completePath || '', {})
          if (res.data) {
            // 是否是 Echarts 组件
            const isECharts =
              targetComponent.chartConfig.package ===
              PackagesCategoryEnum.CHARTS

            try {
              if (isECharts && vChartRef?.value?.setOption) {
                nextTick(() => {
                  if (vChartRef.value) {
                    vChartRef.value.setOption({ dataset: res.data })
                  }
                })
              } else {
                // 若遵守规范使用 datase 作为数据 key，则省自动赋值数据
                targetComponent.option.dataset && (targetComponent.option.dataset = res.data)
              }
              if (updateCallback) {
                updateCallback(res.data)
              }
            } catch (error) {
              console.error(error)
            }
          }
        }, requestInterval.value * 1000)
      }
    })

  return { vChartRef }
}
