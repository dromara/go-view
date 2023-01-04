import { defineStore } from 'pinia'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'
import { EditCanvasType } from '@/store/modules/chartEditStore/chartEditStore.d'
import { loadingStart, loadingFinish, loadingError } from '@/utils'
import { editHistoryMax } from '@/settings/designSetting'
import {
  HistoryStackItemEnum,
  HistoryActionTypeEnum,
  HistoryTargetTypeEnum,
  HistoryItemType,
  ChartHistoryStoreType
} from './chartHistoryStore.d'

export const useChartHistoryStore = defineStore({
  id: 'useChartHistoryStore',
  state: (): ChartHistoryStoreType => ({
    // 后退栈
    backStack: [],
    // 前进栈
    forwardStack: []
  }),
  getters: {
    getBackStack(): Array<HistoryItemType> {
      return this.backStack
    },
    getForwardStack(): Array<HistoryItemType> {
      return this.forwardStack
    }
  },
  actions: {
    /**
     * * 新增记录并插入栈
     * @param item 图表实例
     * @param actionType 动作类型
     * @param targetType 对象类型（默认图表）
     */
    createStackItem(
      item: CreateComponentType[] | CreateComponentGroupType[] | EditCanvasType[],
      actionType: HistoryActionTypeEnum,
      targetType: HistoryTargetTypeEnum = HistoryTargetTypeEnum.CHART
    ) {
      // 优化性能转为 freeze
      this.pushBackStackItem(
        Object.freeze({
          [HistoryStackItemEnum.ID]: new Date().getTime().toString(),
          [HistoryStackItemEnum.HISTORY_DATA]: item,
          [HistoryStackItemEnum.ACTION_TYPE]: actionType,
          [HistoryStackItemEnum.TARGET_TYPE]: targetType
        } as const)
      )
    },
    // * 画布初始化
    canvasInit(canvas: EditCanvasType) {
      this.createStackItem([canvas], HistoryActionTypeEnum.ADD, HistoryTargetTypeEnum.CANVAS)
    },
    // * 推入后退栈
    pushBackStackItem(item: HistoryItemType | Array<HistoryItemType>, notClear = false): void {
      if (item instanceof Array) this.backStack = [...this.backStack, ...item]
      else this.backStack.push(item)
      this.backStack.splice(0, this.backStack.length - editHistoryMax)
      // 新动作需清空前进栈
      if (notClear) return
      this.clearForwardStack()
    },
    // * 推入前进栈
    pushForwardStack(item: HistoryItemType | Array<HistoryItemType>): void {
      if (item instanceof Array) this.forwardStack = [...this.forwardStack, ...item]
      else this.forwardStack.push(item)
    },
    // * 移出后退栈
    popBackStackItem(): HistoryItemType | undefined {
      if (this.backStack.length > 0) {
        return this.backStack.pop()
      }
    },
    // * 移出前进栈
    popForwardStack(): HistoryItemType | undefined {
      if (this.forwardStack.length > 0) {
        return this.forwardStack.pop()
      }
    },
    // * 清空前进栈
    clearForwardStack() {
      this.forwardStack = []
    },
    // * 清空后退栈(保留初始化)
    clearBackStack() {
      const canvasHistory = this.getBackStack[0]
      this.backStack = [canvasHistory]
    },
    // * 撤回
    backAction() {
      try {
        loadingStart()
        // 排除画布初始化
        if (this.getBackStack.length > 1) {
          const targetData = this.popBackStackItem()
          if (!targetData) {
            loadingFinish()
            return
          }
          // 移除记录到前进堆
          this.pushForwardStack(targetData)
          loadingFinish()
          return targetData
        }
        loadingFinish()
      } catch (error) {
        loadingError()
      }
    },
    // * 前进
    forwardAction() {
      try {
        loadingStart()
        if (this.getForwardStack.length) {
          const targetData = this.popForwardStack()
          if (!targetData) {
            loadingFinish()
            return
          }
          // 放入后退栈
          this.pushBackStackItem(targetData, true)
          loadingFinish()
          return targetData
        }
        loadingFinish()
      } catch (error) {
        loadingError()
      }
    },
    // * 新增组件记录
    createAddHistory(item: Array<CreateComponentType | CreateComponentGroupType>) {
      this.createStackItem(item, HistoryActionTypeEnum.ADD, HistoryTargetTypeEnum.CHART)
    },
    // * 更新属性记录（大小、图表属性）
    createUpdateHistory(item: Array<CreateComponentType | CreateComponentGroupType>) {
      this.createStackItem(item, HistoryActionTypeEnum.UPDATE, HistoryTargetTypeEnum.CHART)
    },
    // * 删除组件记录
    createDeleteHistory(item: Array<CreateComponentType | CreateComponentGroupType>) {
      this.createStackItem(item, HistoryActionTypeEnum.DELETE, HistoryTargetTypeEnum.CHART)
    },
    // * 移动组件记录
    createMoveHistory(item: Array<CreateComponentType | CreateComponentGroupType>) {
      this.createStackItem(item, HistoryActionTypeEnum.MOVE, HistoryTargetTypeEnum.CHART)
    },
    // * 改变层级组件记录
    createLayerHistory(
      item: Array<CreateComponentType | CreateComponentGroupType>,
      type:
        | HistoryActionTypeEnum.TOP
        | HistoryActionTypeEnum.DOWN
        | HistoryActionTypeEnum.UP
        | HistoryActionTypeEnum.BOTTOM
    ) {
      this.createStackItem(item, type, HistoryTargetTypeEnum.CHART)
    },
    // * 剪切组件记录
    createPasteHistory(item: Array<CreateComponentType | CreateComponentGroupType>) {
      this.createStackItem(item, HistoryActionTypeEnum.CUT, HistoryTargetTypeEnum.CHART)
    },
    // * 创建分组
    createGroupHistory(item: Array<CreateComponentType | CreateComponentGroupType>) {
      this.createStackItem(item, HistoryActionTypeEnum.GROUP, HistoryTargetTypeEnum.CHART)
    },
    // * 解除分组
    createUnGroupHistory(item: Array<CreateComponentType | CreateComponentGroupType>) {
      this.createStackItem(item, HistoryActionTypeEnum.UN_GROUP, HistoryTargetTypeEnum.CHART)
    },
    // * 锁定记录
    createLockHistory(item: Array<CreateComponentType | CreateComponentGroupType>) {
      this.createStackItem(item, HistoryActionTypeEnum.LOCK, HistoryTargetTypeEnum.CHART)
    },
    // * 解锁记录
    createUnLockHistory(item: Array<CreateComponentType | CreateComponentGroupType>) {
      this.createStackItem(item, HistoryActionTypeEnum.UNLOCK, HistoryTargetTypeEnum.CHART)
    },
    // * 隐藏记录
    createHideHistory(item: Array<CreateComponentType | CreateComponentGroupType>) {
      this.createStackItem(item, HistoryActionTypeEnum.HIDE, HistoryTargetTypeEnum.CHART)
    },
    // * 展示记录
    createShowHistory(item: Array<CreateComponentType | CreateComponentGroupType>) {
      this.createStackItem(item, HistoryActionTypeEnum.SHOW, HistoryTargetTypeEnum.CHART)
    }
  }
})
