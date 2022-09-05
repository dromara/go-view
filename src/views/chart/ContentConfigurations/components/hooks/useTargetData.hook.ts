import { computed, Ref } from 'vue'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'

// 获取当前对象数据
export const useTargetData = () => {
  const chartEditStore = useChartEditStore()
  const targetData: Ref<CreateComponentType | CreateComponentGroupType> = computed(() => {
    const list = chartEditStore.getComponentList
    const targetIndex = chartEditStore.fetchTargetIndex()
    return list[targetIndex]
  })
  return { targetData, chartEditStore }
}
