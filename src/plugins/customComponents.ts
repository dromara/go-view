import type { App } from 'vue'
import { GoSkeleton } from '@/components/GoSkeleton'
import { GoLoading } from '@/components/GoLoading'
import { SketchRule } from 'vue3-sketch-ruler'

/**
 * 全局注册自定义组件
 * @param app
 */
export function setupCustomComponents(app: App) {
  app.component('GoSkeleton', GoSkeleton)
  app.component('GoLoading', GoLoading)
  app.component('SketchRule', SketchRule)
}
