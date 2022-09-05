import {
  HistoryTargetTypeEnum,
  HistoryActionTypeEnum
} from './chartHistoryStore.d'

export const historyActionTypeName = {
  [HistoryActionTypeEnum.ADD]: '新增图表',
  [HistoryActionTypeEnum.DELETE]: '删除图表',
  [HistoryActionTypeEnum.UPDATE]: '修改属性',
  [HistoryActionTypeEnum.MOVE]: '移动图表',
  [HistoryActionTypeEnum.PASTE]: '粘贴图表',
  [HistoryActionTypeEnum.COPY]: '复制图表',
  [HistoryActionTypeEnum.CUT]: '剪切图表',
  [HistoryActionTypeEnum.TOP]: '层级置顶',
  [HistoryActionTypeEnum.BOTTOM]: '层级置底',
  [HistoryActionTypeEnum.UP]: '层级上移',
  [HistoryActionTypeEnum.DOWN]: '层级下移',
  [HistoryActionTypeEnum.GROUP]: '创建分组',
  [HistoryActionTypeEnum.UN_GROUP]: '解除分组',
  [HistoryActionTypeEnum.SELECT_HISTORY]: '选择记录',
  
  [HistoryTargetTypeEnum.CANVAS]: '画布初始化'
}
