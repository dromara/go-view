import { RouteRecordRaw } from 'vue-router'
import { PreviewEnum } from '@/enums/pageEnum'

// 引入路径
const importPath = {
  'PreviewEnum.CHART_PREVIEW_NAME': () => import('@/views/preview/wrapper.vue')
}

const chartRoutes: RouteRecordRaw = {
  path: PreviewEnum.CHART_PREVIEW,
  name: PreviewEnum.CHART_PREVIEW_NAME,
  component: importPath['PreviewEnum.CHART_PREVIEW_NAME'],
  meta: {
    title: '预览',
    isRoot: true
  }
}


export default chartRoutes