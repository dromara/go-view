import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { WinKeyboard, MacKeyboard, MenuEnum } from '@/enums/editPageEnum'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

import keymaster from 'keymaster'
// Keymaster可以支持识别以下组合键： ⇧，shift，option，⌥，alt，ctrl，control，command，和⌘
const chartEditStore = useChartEditStore()

const winCtrlMerge = (e: string) => `${WinKeyboard.CTRL}+${e}`
const winShiftMerge = (e: string) => `${WinKeyboard.SHIFT}+${e}`
const winAltMerge = (e: string) => `${WinKeyboard.ALT}+${e}`

export const winKeyboardValue = {
  [MenuEnum.ARROW_UP]: winCtrlMerge('up'),
  [MenuEnum.ARROW_RIGHT]: winCtrlMerge('right'),
  [MenuEnum.ARROW_DOWN]: winCtrlMerge('down'),
  [MenuEnum.ARROW_LEFT]: winCtrlMerge('left'),
  [MenuEnum.COPY]: winCtrlMerge('c'),
  [MenuEnum.CUT]: winCtrlMerge('x'),
  [MenuEnum.PARSE]: winCtrlMerge('v'),
  [MenuEnum.DELETE]: 'delete',
  [MenuEnum.BACK]: winCtrlMerge('z'),
  [MenuEnum.FORWORD]: winCtrlMerge(winShiftMerge('z')),
}

// 这个 Ctrl 后面还是换成了 ⌘
const macCtrlMerge = (e: string) => `${MacKeyboard.CTRL}+${e}`
const macShiftMerge = (e: string) => `${MacKeyboard.SHIFT}+${e}`
const macAltMerge = (e: string) => `${MacKeyboard.ALT}+${e}`

// 没有测试 macOS 系统，因为我没有😤👻
export const macKeyboardValue = {
  [MenuEnum.ARROW_UP]: macCtrlMerge('arrowup'),
  [MenuEnum.ARROW_RIGHT]: macCtrlMerge('arrowright'),
  [MenuEnum.ARROW_DOWN]: macCtrlMerge('arrowdown'),
  [MenuEnum.ARROW_LEFT]: macCtrlMerge('arrowleft'),
  [MenuEnum.COPY]: macCtrlMerge('c'),
  [MenuEnum.CUT]: macCtrlMerge('x'),
  [MenuEnum.PARSE]: macCtrlMerge('v'),
  [MenuEnum.DELETE]: macCtrlMerge('backspace'),
  [MenuEnum.BACK]: macCtrlMerge('z'),
  [MenuEnum.FORWORD]: macCtrlMerge(macShiftMerge('z')),
}

// Win 快捷键列表
const winKeyList: Array<string> = [
  winKeyboardValue.up,
  winKeyboardValue.right,
  winKeyboardValue.down,
  winKeyboardValue.left,

  winKeyboardValue.delete,
  winKeyboardValue.copy,
  winKeyboardValue.cut,
  winKeyboardValue.parse,

  winKeyboardValue.back,
  winKeyboardValue.forward,
]

// Mac 快捷键列表
const macKeyList: Array<string> = [
  macKeyboardValue.up,
  macKeyboardValue.right,
  macKeyboardValue.down,
  macKeyboardValue.left,

  macKeyboardValue.delete,
  macKeyboardValue.copy,
  macKeyboardValue.cut,
  macKeyboardValue.parse,

  macKeyboardValue.back,
  macKeyboardValue.forward,
]

// 初始化监听事件
export const useAddKeyboard = () => {
  const switchHande = (keyboardValue: typeof winKeyboardValue, e: string) => {
    switch (e) {
      // ct+↑
      case keyboardValue.up:
        keymaster(e, throttle(() => { chartEditStore.setMove(MenuEnum.ARROW_UP); return false }, 200))
        break;
      // ct+→
      case keyboardValue.right:
        keymaster(e, throttle(() => { chartEditStore.setMove(MenuEnum.ARROW_RIGHT); return false }, 200))
        break;
      // ct+↓
      case keyboardValue.down:
        keymaster(e, throttle(() => { chartEditStore.setMove(MenuEnum.ARROW_DOWN); return false }, 200))
        break;
      // ct+←
      case keyboardValue.left:
        keymaster(e, throttle(() => { chartEditStore.setMove(MenuEnum.ARROW_LEFT); return false }, 200))
        break;

      // 删除 delete
      case keyboardValue.delete:
        keymaster(e, debounce(() => { chartEditStore.removeComponentList(); return false }, 200))
        break;
      // 复制 ct+v
      case keyboardValue.copy:
        keymaster(e, debounce(() => { chartEditStore.setCopy(); return false }, 200))
        break;
      // 剪切 ct+x
      case keyboardValue.cut:
        keymaster(e, debounce(() => { chartEditStore.setCut(); return false }, 200))
        break;
      // 粘贴 ct+v
      case keyboardValue.parse:
        keymaster(e, throttle(() => { chartEditStore.setParse(); return false }, 200))
        break;

      // 撤回 ct+z
      case keyboardValue.back:
        keymaster(e, throttle(() => { chartEditStore.setBack(); return false }, 200))
        break;
      // 前进 ct+sh+z
      case keyboardValue.forward:
        keymaster(e, throttle(() => { chartEditStore.setForward(); return false }, 200))
        break;
    }
  }
  winKeyList.forEach((key: string) => {
    switchHande(winKeyboardValue, key)
  })
  macKeyList.forEach((key: string) => {
    switchHande(macKeyboardValue, key)
  })
}

// 卸载监听事件
export const useRemoveKeyboard = () => {
  winKeyList.forEach((key: string) => {
    keymaster.unbind(key)
  })
  macKeyList.forEach((key: string) => {
    keymaster.unbind(key)
  })
}