import { HistoryTargetTypeEnum, HistoryActionTypeEnum } from './chartHistoryStore.d'

export const historyActionTypeName = {
  [HistoryActionTypeEnum.ADD]: '新增',
  [HistoryActionTypeEnum.DELETE]: '删除',
  [HistoryActionTypeEnum.UPDATE]: '更新',
  [HistoryActionTypeEnum.MOVE]: '移动',
  [HistoryActionTypeEnum.PASTE]: '粘贴',
  [HistoryActionTypeEnum.COPY]: '复制',
  [HistoryActionTypeEnum.CUT]: '剪切',
  [HistoryActionTypeEnum.TOP]: '置顶',
  [HistoryActionTypeEnum.BOTTOM]: '置底',
  [HistoryActionTypeEnum.UP]: '上移',
  [HistoryActionTypeEnum.DOWN]: '下移',
  [HistoryActionTypeEnum.GROUP]: '成组',
  [HistoryActionTypeEnum.UN_GROUP]: '解组',
  [HistoryActionTypeEnum.LOCK]: '锁定',
  [HistoryActionTypeEnum.UNLOCK]: '解锁',
  [HistoryActionTypeEnum.HIDE]: '隐藏',
  [HistoryActionTypeEnum.SHOW]: '显示',

  [HistoryTargetTypeEnum.CANVAS]: '画布初始化'
}
