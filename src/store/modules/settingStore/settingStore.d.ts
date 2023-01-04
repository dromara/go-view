export enum ToolsStatusEnum {
  DOCK = 'dock',
  ASIDE = 'aside',
}

export enum SettingStoreEnums {
  // 拖拽页面左侧表单分类只有一项的时候是否隐藏
  HIDE_PACKAGE_ONE_CATEGORY = 'hidePackageOneCategory',
  // 切换语言是否进行路由刷新
  CHANGE_LANG_RELOAD = 'changeLangReload',
  // 侧边栏折叠是否隐藏全部
  ASIDE_ALL_COLLAPSED = 'asideAllCollapsed',
  // 图表移动时按方向键移动的距离
  CHART_MOVE_DISTANCE = 'chartMoveDistance',
  // 图表拖拽时的吸附距离（px）
  CHART_ALIGN_RANGE = 'chartAlignRange',
  // 图表工具栏状态（侧边工具状态）
  CHART_TOOLS_STATUS = 'chartToolsStatus',
  // 图表工具栏状态隐藏
  CHART_TOOLS_STATUS_HIDE = 'chartToolsStatusHide'
}

export interface SettingStoreType {
  [SettingStoreEnums.HIDE_PACKAGE_ONE_CATEGORY]: boolean
  [SettingStoreEnums.CHANGE_LANG_RELOAD]: boolean
  [SettingStoreEnums.ASIDE_ALL_COLLAPSED]: boolean
  [SettingStoreEnums.CHART_MOVE_DISTANCE]: number
  [SettingStoreEnums.CHART_ALIGN_RANGE]: number
  [SettingStoreEnums.CHART_TOOLS_STATUS]: ToolsStatusEnum
  [SettingStoreEnums.CHART_TOOLS_STATUS_HIDE]: boolean
}
