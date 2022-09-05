interface Window {
  $loading: any
  $message: any
  $dialog: any
  // 语言
  $t: any
  $vue: any
  // 键盘按键记录
  $KeyboardActive?: Set<string>
}

declare type Recordable<T = any> = Record<string, T>