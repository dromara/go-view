import { App } from 'vue';
import VueLazyLoad from 'vue3-lazyload'
import { requireErrorImg } from '@/utils'

// import { x } from '@/directives';

/**
 * 注册全局自定义指令
 * @param app
 */
export function setupDirectives(app: App) {
  // 图片懒加载
  app.use(VueLazyLoad, {
    error: requireErrorImg(),
  })
  // app.directive('x', x);
}
