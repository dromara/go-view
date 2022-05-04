import { ref } from 'vue'
import { ChartEditStorageType } from '../index.d'
import { CreateComponentType } from '@/packages/index.d'
import { fetchChartComponent } from '@/packages/index'

export const useComInstall = (localStorageInfo: ChartEditStorageType) => {
  const show = ref(false)

  // 注册组件(一开始无法获取window['$vue'])
  const intervalTiming = setInterval(() => {
    if (window['$vue'].component) {
      clearInterval(intervalTiming)
      localStorageInfo.componentList.forEach(async (e: CreateComponentType) => {
        if (!window['$vue'].component(e.chartConfig.chartKey)) {
          window['$vue'].component(
            e.chartConfig.chartKey,
            fetchChartComponent(e.chartConfig)
          )
        }
      })
      show.value = true
    }
  }, 200)

  return {
    show
  }
}
