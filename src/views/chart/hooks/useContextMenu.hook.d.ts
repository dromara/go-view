// 右键枚举
export enum MenuEnum {
  DELETE = 'delete',
  COPY = 'copy',
  CUT = 'cut',
  PARSE = 'parse',
  TOP = 'top',
  BOTTOM = 'bottom',
  UP = 'up',
  DOWN = 'down',
  CLEAR = 'clear',
}

export interface MenuOptionsItemType {
  type?: string
  label?: string
  key: MenuEnum | string
  icon?: Function
  fnHandle?: Function
  disabled?: boolean
  hidden?: boolean
}