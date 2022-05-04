import { RouteRecordRaw } from 'vue-router'
import { ChartEnum } from '@/enums/pageEnum'

// 引入路径
const importPath = {
  'ChartEnum.CHART_HOME_NAME': () => import('@/views/chart/index.vue')
}

const chartRoutes: RouteRecordRaw = {
  path: ChartEnum.CHART_HOME,
  name: ChartEnum.CHART_HOME_NAME,
  component: importPath['ChartEnum.CHART_HOME_NAME'],
  meta: {
    title: '工作空间',
    isRoot: true
  }
}


export default chartRoutes