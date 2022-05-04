import { icon } from '@/plugins'
import { DialogEnum } from '@/enums/pluginEnum'
import { dialogIconSize } from '@/settings/designSetting'
import { maskClosable } from '@/settings/designSetting'
import { DialogReactive } from 'naive-ui'
const { InformationCircleIcon } = icon.ionicons5
import { renderIcon } from '@/utils'

// * 开启加载
export const loadingStart = () => {
  window['$loading'].start()
}

// * 加载结束
export const loadingFinish = () => {
  setTimeout(() => {
    window['$loading'].finish()
  })
}

// * 加载错误
export const loadingError = () => {
  setTimeout(() => {
    window['$loading'].error()
  })
}

/**
 * * render 对话框
 * @param { Object} params 配置参数, 详见 https://www.naiveui.com/zh-CN/light/components/dialog
 * @param { Function } dialogFn 函数
 * ```
 * 最简易的 demo
 * goDialog({
 *    onPositiveCallback: () => {}
 * })
 * ```
 */
export const goDialog = (
  params: {
    // 基本
    type?: DialogEnum
    // 标题
    title?: string | (() => any)
    // 提示
    message?: string
    // 取消提示词
    negativeText?: string
    // 取消按钮的属性
    negativeButtonProps?: object,
    // 确定提示词
    positiveText?: string
    // 确定按钮的属性
    positiveButtonProps?: object,
    // 点击遮罩是否关闭
    isMaskClosable?: boolean
    // 回调
    onPositiveCallback: Function
    onNegativeCallback?: Function
    // 异步
    promise?: boolean
    promiseResCallback?: Function
    promiseRejCallback?: Function
  },
  dialogFn?: Function
) => {
  const {
    type,
    title,
    message,
    negativeText,
    negativeButtonProps,
    positiveText,
    positiveButtonProps,
    isMaskClosable,
    onPositiveCallback,
    onNegativeCallback,
    promise,
    promiseResCallback,
    promiseRejCallback
  } = params

  const typeObj = {
    // 自定义
    [DialogEnum.DELETE]: {
      fn: dialogFn || window['$dialog'].warning,
      message: message || '是否删除此数据?'
    },
    // 原有
    [DialogEnum.WARNING]: {
      fn: window['$dialog'].warning,
      message: message || '是否执行此操作?'
    },
    [DialogEnum.ERROR]: {
      fn: window['$dialog'].error,
      message: message || '是否执行此操作?'
    },
    [DialogEnum.SUCCESS]: {
      fn: window['$dialog'].success,
      message: message || '是否执行此操作?'
    }
  }

  const dialog: DialogReactive = typeObj[type || DialogEnum.WARNING]['fn']({
    // 导入其余 NaiveUI 支持参数
    ...params,
    title: title || '提示',
    icon: renderIcon(InformationCircleIcon, { size: dialogIconSize }),
    content: typeObj[type || DialogEnum.WARNING]['message'],
    positiveText: positiveText || '确定',
    negativeText: negativeText || '取消',
    // 是否通过遮罩关闭
    maskClosable: isMaskClosable || maskClosable,
    onPositiveClick: async () => {
      // 执行异步
      if (promise && onPositiveCallback) {
        dialog.loading = true
        try {
          const res = await onPositiveCallback()
          promiseResCallback && promiseResCallback(res)
        } catch (err) {
          promiseRejCallback && promiseRejCallback(err)
        }
        dialog.loading = false
        return
      }
      onPositiveCallback && onPositiveCallback(dialog)
    },
    onNegativeClick: async () => {
      onNegativeCallback && onNegativeCallback(dialog)
    }
  })
}
