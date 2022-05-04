interface Window {
  $loading: any
  $message: any
  $dialog: any
  // 语言
  $t: any
  $vue: any
}

declare type Recordable<T = any> = Record<string, T>