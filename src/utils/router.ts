import { useRoute } from 'vue-router'
import { ResultEnum } from '@/enums/httpEnum'
import { ErrorPageNameMap, PageEnum } from '@/enums/pageEnum'
import { docPath, giteeSourceCodePath } from '@/settings/pathConst'
import { cryptoDecode } from './crypto'
import { StorageEnum } from '@/enums/storageEnum'
import { clearLocalStorage, getLocalStorage } from './storage'
import router from '@/router'

/**
 * * 根据名字跳转路由
 * @param pageName
 * @param isReplace
 * @param windowOpen
 */
export const routerTurnByName = (
  pageName: string,
  isReplace?: boolean,
  windowOpen?: boolean
) => {
  if (windowOpen) {
    const path = fetchPathByName(pageName, 'href')
    openNewWindow(path)
    return
  }
  if (isReplace) {
    router.replace({
      name: pageName,
    })
    return
  }
  router.push({
    name: pageName,
  })
}

/**
 * * 根据名称获取路由信息
 * @param pageName
 * @param pageName
 */
export const fetchPathByName = (pageName: string, p?: string) => {
  try {
    const pathData = router.resolve({
      name: pageName,
    })
    return p ? (pathData as any)[p] : pathData
  } catch (error) {
    window['$message'].warning('查询路由信息失败，请联系管理员！')
  }
}

/**
 * * 根据路径跳转路由
 * @param path
 * @param query
 * @param isReplace
 * @param windowOpen
 */
export const routerTurnByPath = (
  path: string,
  query?: Array<string | number>,
  isReplace?: boolean,
  windowOpen?: boolean
) => {
  let fullPath = ''
  if (query?.length) {
    fullPath = `${path}/${query.join('/')}`
  }
  if (windowOpen) {
    return openNewWindow(fullPath)
  }
  if (isReplace) {
    router.replace({
      path: fullPath,
    })
    return
  }
  router.push({
    path: fullPath,
  })
}

/**
 * * 错误页重定向
 * @param icon
 * @returns
 */
export const redirectErrorPage = (code: ResultEnum) => {
  if (!code) return false
  const pageName = ErrorPageNameMap.get(code)
  if (!pageName) return false
  routerTurnByName(pageName)
}

/**
 * * 重新加载当前路由页面
 */
export const reloadRoutePage = () => {
  routerTurnByName(PageEnum.RELOAD_NAME)
}

/**
 * * 退出
 */
export const logout = () => {
  clearLocalStorage(StorageEnum.GO_LOGIN_INFO_STORE)
  routerTurnByName(PageEnum.BASE_LOGIN_NAME)
}

/**
 * * 新开页面
 * @param url
 */
export const openNewWindow = (url: string) => {
  return window.open(url, '_blank')
}

/**
 * * 打开项目文档
 * @param url
 */
export const openDoc = () => {
  openNewWindow(docPath)
}

/**
 * * 打开码云仓库地址
 * @param url
 */
export const openGiteeSourceCode = () => {
  openNewWindow(giteeSourceCodePath)
}

/**
 * * 判断是否是预览页
 * @returns boolean
 */
export const isPreview = () => {
  return document.location.hash.includes('preview')
}

/**
 * * 获取当前路由下的参数
 * @returns object
 */
export const fetchRouteParams = () => {
  try {
    const route = useRoute()
    return route.params
  } catch (error) {
    window['$message'].warning('查询路由信息失败，请联系管理员！')
  }
}

/**
 * * 通过硬解析获取当前路由下的参数
 * @returns object
 */
 export const fetchRouteParamsLocation = () => {
  try {
    return document.location.hash.split('/').pop() || ''
  } catch (error) {
    window['$message'].warning('查询路由信息失败，请联系管理员！')
    return ''
  }
}

/**
 * * 回到主页面
 * @param confirm
 */
export const goHome = () => {
  routerTurnByName(PageEnum.BASE_HOME_NAME)
}

/**
 * * 判断是否登录（现阶段是有 login 数据即可）
 * @return boolean
 */
export const loginCheck = () => {
  try {
    const info = getLocalStorage(StorageEnum.GO_LOGIN_INFO_STORE)
    if (!info) return false
    const decodeInfo = cryptoDecode(info)
    if (decodeInfo) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
} 