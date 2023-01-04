import { RouteRecordRaw } from 'vue-router'
import { EditEnum } from '@/enums/pageEnum'

// 引入路径
const importPath = {
  [EditEnum.CHART_EDIT_NAME]: () => import('@/views/edit/index.vue')
}

const chartRoutes: RouteRecordRaw = {
  path: EditEnum.CHART_EDIT,
  name: EditEnum.CHART_EDIT_NAME,
  component: importPath[EditEnum.CHART_EDIT_NAME],
  meta: {
    title: '编辑',
    isRoot: true
  }
}


export default chartRoutes