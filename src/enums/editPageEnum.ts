// 页面拖拽键名
export enum DragKeyEnum {
  DROG_KEY = 'ChartData'
}

// 右键枚举
export enum MenuEnum {
  ARROW_UP = 'up',
  ARROW_RIGHT = 'right',
  ARROW_DOWN = 'down',
  ARROW_LEFT = 'left',
  DELETE = 'delete',
  COPY = 'copy',
  CUT = 'cut',
  PARSE = 'parse',
  TOP = 'top',
  BOTTOM = 'bottom',
  UP = 'up',
  DOWN = 'down',
  CLEAR = 'clear',
  BACK = 'back',
  FORWORD = 'forward',
  SAVE = 'save'
}

// Win 键盘枚举
export enum WinKeyboard {
  CTRL = 'ctrl',
  SHIFT = 'shift',
  ALT = ' alt',
}

// Mac 键盘枚举
export enum MacKeyboard {
  // 还是用 Command 吧
  CTRL = '⌘',
  SHIFT = '⇧',
  ALT = '⌥',
}

// 同步状态枚举
export enum SyncEnum {
  // 等待
  PENDING,
  // 开始
  START,
  // 成功
  SUCCESS,
  // 失败
  FAILURE
}