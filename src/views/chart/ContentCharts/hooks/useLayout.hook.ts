import { ref, toRefs } from 'vue'

// 布局
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore'
// 样式
import { useDesignStore } from '@/store/modules/designStore/designStore'

// 全局颜色
const designStore = useDesignStore()
const themeColor = ref(designStore.getAppTheme)

// 结构控制
const { setItem } = useChartLayoutStore()
const { getCharts } = toRefs(useChartLayoutStore())

export {
  themeColor,
  setItem,
  getCharts
}