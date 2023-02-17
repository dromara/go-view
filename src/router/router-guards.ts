import { Router } from 'vue-router';
import { PageEnum } from '@/enums/pageEnum'
import { loginCheck } from '@/utils'

export function createRouterGuards(router: Router) {
  // 前置
  router.beforeEach(async (to, from, next) => {
    const Loading = window['$loading'];
    Loading && Loading.start();
    const isErrorPage = router.getRoutes().findIndex((item) => item.name === to.name);
    if (isErrorPage === -1) {
      next({ name: PageEnum.ERROR_PAGE_NAME_404 })
    }

    if (!loginCheck()) {
      if (to.name === PageEnum.BASE_LOGIN_NAME) {
        next()
      }
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