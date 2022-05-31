/**
 * * 请求失败统一处理
 */
export const httpErrorHandle = () => {
  window['$message'].error(window['$t']('http.error_message'))
}