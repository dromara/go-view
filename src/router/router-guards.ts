import { Router } from 'vue-router';
import { PageEnum, PreviewEnum } from '@/enums/pageEnum'
import { loginCheck } from '@/utils'

// 路由白名单
const routerAllowList = [
  // 登录
  PageEnum.BASE_LOGIN_NAME,
  // 预览
  PreviewEnum.CHART_PREVIEW_NAME
]

export function createRouterGuards(router: Router) {
  // 前置
  router.beforeEach(async (to, from, next) => {
    const Loading = window['$loading'];
    Loading && Loading.start();
    const isErrorPage = router.getRoutes().findIndex((item) => item.name === to.name);
    if (isErrorPage === -1) {
      next({ name: PageEnum.ERROR_PAGE_NAME_404 })
    }

    // @ts-ignore
    if (!routerAllowList.includes(to.name) && !loginCheck()) {
      next({ name: PageEnum.BASE_LOGIN_NAME })
    }
    next()
  })

  router.afterEach((to, _, failure) => {
    const Loading = window['$loading'];
    document.title = (to?.meta?.title as string) || document.title;
    Loading && Loading.finish();
  })

  // 错误
  router.onError((error) => {
    console.log(error, '路由错误');
  });
}