import { defineStore } from 'pinia'
import { getUUID, loadingStart, loadingFinish, loadingError } from '@/utils'
import { CreateComponentType } from '@/packages/index.d'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import { defaultTheme, globalThemeJson } from '@/settings/chartThemes/index'
import { requestInterval, previewScaleType } from '@/settings/designSetting'
// 记录记录
import { useChartHistoryStore } from '@/store/modules/chartHistoryStore/chartHistoryStore'
// 全局设置
import { useSettingStore } from '@/store/modules/settingStore/settingStore'
import { HistoryActionTypeEnum, HistoryItemType, HistoryTargetTypeEnum } from '@/store/modules/chartHistoryStore/chartHistoryStore.d'
import { MenuEnum } from '@/enums/editPageEnum'
import { PreviewScaleEnum } from '@/enums/styleEnum'
import {
  ChartEditStoreEnum,
  ChartEditStorage,
  ChartEditStoreType,
  EditCanvasType,
  MousePositionType,
  TargetChartType,
  RecordChartType,
  RequestGlobalConfigType,
  EditCanvasConfigType
} from './chartEditStore.d'

const chartHistoryStore = useChartHistoryStore()
const settingStore = useSettingStore()

// 编辑区域内容
export const useChartEditStore = defineStore({
  id: 'useChartEditStore',
  state: (): ChartEditStoreType => ({
    // 画布属性
    editCanvas: {
      // 编辑区域 Dom
      editLayoutDom: null,
      editContentDom: null,
      // 偏移量
      offset: 20,
      // 系统控制缩放
      scale: 1,
      // 用户控制的缩放
      userScale: 1,
      // 锁定缩放
      lockScale: false,
      // 初始化
      isCreate: false,
      // 拖拽中
      isDrag: false
    },
    // 右键菜单
    rightMenuShow: false,
    // 鼠标定位
    mousePosition: {
      startX: 0,
      startY: 0,
      x: 0,
      y: 0
    },
    // 目标图表
    targetChart: {
      hoverId: undefined,
      selectId: undefined
    },
    // 记录临时数据（复制等）
    recordChart: undefined,
    // -----------------------
    // 画布属性（需存储给后端）
    editCanvasConfig: {
      // 默认宽度
      width: 1920,
      // 默认高度
      height: 1080,
      // 色相
      hueRotate: 0,
      // 饱和度
      saturate: 1,
      // 对比度
      contrast: 1,
      // 亮度
      brightness: 1,
      // 透明度
      opacity: 1,
      // 变换（暂不更改）
      rotateZ: 0,
      rotateX: 0,
      rotateY: 0,
      skewX: 0,
      skewY: 0,
      // 默认背景色
      background: undefined,
      backgroundImage: undefined,
      // 是否使用纯颜色
      selectColor: true,
      // chart 主题色
      chartThemeColor: defaultTheme || 'dark',
      // 全局配置
      chartThemeSetting: globalThemeJson,
      // 预览方式
      previewScaleType: previewScaleType
    },
    // 数据请求处理（需存储给后端）
    requestGlobalConfig: {
      requestOriginUrl: '',
      requestInterval: requestInterval 
    },
    // 图表数组（需存储给后端）
    componentList: []
  }),
  getters: {
    getMousePosition(): MousePositionType {
      return this.mousePosition
    },
    getRightMenuShow(): boolean {
      return this.rightMenuShow
    },
    getEditCanvas(): EditCanvasType {
      return this.editCanvas
    },
    getEditCanvasConfig(): EditCanvasConfigType {
      return this.editCanvasConfig
    },
    getTargetChart():TargetChartType {
      return this.targetChart
    },
    getRecordChart(): RecordChartType | undefined {
      return this.recordChart
    },
    getRequestGlobalConfig(): RequestGlobalConfigType {
      return this.requestGlobalConfig
    },
    getComponentList(): CreateComponentType[] {
      return this.componentList
    },
    // 获取需要存储的数据项
    getStorageInfo(): ChartEditStorage {
      return {
        [ChartEditStoreEnum.EDIT_CANVAS_CONFIG]: this.getEditCanvasConfig,
        [ChartEditStoreEnum.COMPONENT_LIST]: this.getComponentList,
        [ChartEditStoreEnum.REQUEST_GLOBAL_CONFIG]: this.getRequestGlobalConfig
      }
    }
  },
  actions: {
    // * 设置 editCanvas 数据项
    setEditCanvas<T extends keyof EditCanvasType,  K extends EditCanvasType[T]>(key: T, value: K) {
      this.editCanvas[key] = value
    },
    // * 设置 editCanvasConfig（需保存后端） 数据项
    setEditCanvasConfig<T extends keyof EditCanvasConfigType,  K extends EditCanvasConfigType[T]>(key: T, value: K) {
      this.editCanvasConfig[key] = value
    },
    // * 设置右键菜单
    setRightMenuShow(value: boolean) {
      this.rightMenuShow = value
    },
    // * 设置目标数据 hover
    setTargetHoverChart(hoverId?:TargetChartType["hoverId"]) {
      this.targetChart.hoverId = hoverId
    },
    // * 设置目标数据 select
    setTargetSelectChart(selectId?:TargetChartType["selectId"]) {
      this.targetChart.selectId = selectId
    },
    // * 设置记录数据
    setRecordChart(item: RecordChartType | undefined) {
      this.recordChart = cloneDeep(item)
    },
    // * 设置鼠标位置
    setMousePosition(x?: number, y?: number, startX?: number, startY?: number): void {
      if (startX) this.mousePosition.startX = startX
      if (startY) this.mousePosition.startY = startY
      if (x) this.mousePosition.x = x
      if (y) this.mousePosition.y = y
    },
    // * 找到目标 id 数据下标位置（无则返回-1）
    fetchTargetIndex(id?: string): number {
      const targetId = id || this.getTargetChart.selectId
      if(!targetId) {
        loadingFinish()
        return -1
      }
      const index = this.componentList.findIndex(e => e.id === targetId)
      if (index === -1) {
        loadingError()
      }
      return index
    },
    /**
     * * 新增组件列表
     * @param chartConfig 新图表实例
     * @param isHead 是否头部插入
     * @param isHistory 是否进行记录
     * @returns
     */
    addComponentList(chartConfig: CreateComponentType, isHead = false, isHistory = false): void {
      if (isHistory) {
        chartHistoryStore.createAddHistory(chartConfig)
      }
      if (isHead) {
        this.componentList.unshift(chartConfig)
        return
      }
      this.componentList.push(chartConfig)
    },
    // * 删除组件列表
    removeComponentList(isHistory = true): void {
      try {
        loadingStart()
        const index  = this.fetchTargetIndex()
        if (index !== -1) {
          isHistory ? chartHistoryStore.createDeleteHistory(this.getComponentList[index]) : undefined
          this.componentList.splice(index, 1)
          loadingFinish()
          return
        }
      } catch(value) {
        loadingError()
      }
    },
    // * 更新组件列表某一项的值
    updateComponentList(index: number, newData: CreateComponentType) {
      if (index < 1 && index > this.getComponentList.length) return
      this.componentList[index] = newData
    },
    // * 设置页面样式属性
    setPageStyle<T extends keyof CSSStyleDeclaration>(
      key: T,
      value: any
    ): void {
      const dom = this.getEditCanvas.editContentDom
      if (dom) {
        dom.style[key] = value
      }
    },
    // * 移动组件列表层级位置到两端
    setBothEnds(isEnd = false, isHistory = true): void {
      try {
        loadingStart()
        const length = this.getComponentList.length
        if (length < 2) {
          loadingFinish()
          return
        }

        const index  = this.fetchTargetIndex()
        const targetData = this.getComponentList[index]
        if (index !== -1) {
          // 置底排除最底层, 置顶排除最顶层
          if ((isEnd && index === 0) || (!isEnd && index === length - 1 )) {
            loadingFinish()
            return
          }

          // 记录原有位置
          const setIndex = (t:CreateComponentType, i:number) => {
            const temp = cloneDeep(t)
            temp.attr.zIndex = i
            return temp
          }

          // 历史记录
          if (isHistory) {
            chartHistoryStore.createLaryerHistory(
              setIndex(targetData, index),
              isEnd ? HistoryActionTypeEnum.BOTTOM : HistoryActionTypeEnum.TOP
            )
          }

          // 插入两端
          this.addComponentList(targetData, isEnd)
          this.getComponentList.splice(isEnd ? index + 1: index, 1)
          loadingFinish()
          return
        }
      } catch(value) {
        loadingError()
      }
    },
    // * 置顶
    setTop(isHistory = true): void {
      this.setBothEnds(false, isHistory)
    },
    // * 置底
    setBottom(isHistory = true): void {
      this.setBothEnds(true, isHistory)
    },
    // * 上移/下移互换图表位置
    wrap(isDown = false, isHistory = true) {
      try {
        loadingStart()
        const length = this.getComponentList.length
        if (length < 2) {
          loadingFinish()
          return
        }

        const index:number  = this.fetchTargetIndex()
        if (index !== -1) {
          // 下移排除最底层, 上移排除最顶层
          if ((isDown && index === 0) || (!isDown && index === length - 1)) {
            loadingFinish()
            return
          }
          // 互换位置
          const swapIndex = isDown ? index - 1 : index + 1
          const targetItem = this.getComponentList[index]
          const swapItem = this.getComponentList[swapIndex]

          // 历史记录
          if (isHistory) {
            chartHistoryStore.createLaryerHistory(
              targetItem,
              isDown ? HistoryActionTypeEnum.DOWN : HistoryActionTypeEnum.UP
            )
          }
          this.updateComponentList(index, swapItem)
          this.updateComponentList(swapIndex, targetItem)
          loadingFinish()
          return
        }
      } catch(value) {
        loadingError()
      }
    },
    // * 图层上移
    setUp(isHistory = true) {
      this.wrap(false, isHistory)
    },
    // * 图层下移
    setDown(isHistory = true) {
      this.wrap(true, isHistory)
    },
    // * 复制
    setCopy(isCut = false) {
      try {
        loadingStart()
        const index:number  = this.fetchTargetIndex()
        if (index !== -1) {
          const copyData:RecordChartType = {
           charts :this.getComponentList[index],
           type: isCut ? HistoryActionTypeEnum.CUT : HistoryActionTypeEnum.COPY
          }
          this.setRecordChart(copyData)
          window['$message'].success(isCut ? '剪切成功' : '复制成功！')
          loadingFinish()
        }
      } catch(value) {
        loadingError()
      }
    },
    // * 剪切
    setCut() {
      this.setCopy(true)
    },
    // * 粘贴
    setParse() {
      try {
        loadingStart()
        const recordCharts = this.getRecordChart
        if (recordCharts === undefined) {
          loadingFinish()
          return
        }
        const parseHandle = (e: CreateComponentType) => {
          e = cloneDeep(e)
          // 生成新 id
          e.id = getUUID()
          // 偏移位置
          e.attr.x = this.getMousePosition.x + 30
          e.attr.y = this.getMousePosition.y + 30
          return e
        }
        const isCut = recordCharts.type === HistoryActionTypeEnum.CUT
        // 多项
        if (Array.isArray(recordCharts.charts)) {
          recordCharts.charts.forEach((e: CreateComponentType) => {
            this.addComponentList(parseHandle(e), undefined, true)
            // 剪切需删除原数据
            if (isCut) {
              this.setTargetSelectChart(e.id)
              this.removeComponentList(true)
            }
          })
          if (isCut) this.setRecordChart(undefined)
          loadingFinish()
          return
        }
        // 单项
        this.addComponentList(parseHandle(recordCharts.charts), undefined, true)
        if (isCut) {
          this.setTargetSelectChart(recordCharts.charts.id)
          this.removeComponentList()
          this.setRecordChart(undefined)
        }
        loadingFinish()
      } catch(value) {
        loadingError()
      }
    },
    // * 撤回/前进 目标处理
    setBackAndSetForwardHandle(item: HistoryItemType, isForward = false) {
      // 处理画布
      if (item.targetType === HistoryTargetTypeEnum.CANVAS) {
        this.editCanvas = item.historyData as EditCanvasType
        return
      }

      const historyData = item.historyData as CreateComponentType

      // 处理新增类型
      const isAdd = item.actionType === HistoryActionTypeEnum.ADD
      const isDel = item.actionType === HistoryActionTypeEnum.DELETE
      this.setTargetSelectChart(historyData.id)
      if (isAdd || isDel) {
        if ((isAdd && isForward) || (isDel && !isForward)) {
          this.addComponentList(historyData)
          return  
        }
        this.removeComponentList(false)
        return
      }

      // 处理层级
      const isTop = item.actionType === HistoryActionTypeEnum.TOP
      const isBottom = item.actionType === HistoryActionTypeEnum.BOTTOM
      if (isTop || isBottom) {
        if (!isForward) {
          // 插入到原有位置
          if (isTop) this.getComponentList.pop()
          if (isBottom) this.getComponentList.shift()
          this.getComponentList.splice(historyData.attr.zIndex, 0, historyData)
          return
        }
        if (isTop) this.setTop(false)
        if (isBottom) this.setBottom(false)
      }

      const isUp = item.actionType === HistoryActionTypeEnum.UP
      const isDown = item.actionType === HistoryActionTypeEnum.DOWN
      if (isUp || isDown) {
        if ((isUp && isForward) || (isDown && !isForward)) {
          this.setUp(false)
          return
        }
        this.setDown(false)
        return
      }

      // 处理内容修改
      this.getComponentList[this.fetchTargetIndex()] = item.historyData as CreateComponentType
    },
    // * 撤回
    setBack() {
      try {
        loadingStart()
        const targetData = chartHistoryStore.backAction()
        if (!targetData) {
          loadingFinish()
          return
        }
        if (Array.isArray(targetData)) {
          targetData.forEach((e: HistoryItemType) => {
            this.setBackAndSetForwardHandle(e)
          })
          loadingFinish()
          return
        }
        this.setBackAndSetForwardHandle(targetData)
        loadingFinish()

      } catch(value) {
        loadingError()
      }
    },
    // * 前进
    setForward() {
      try {
        loadingStart()
        const targetData = chartHistoryStore.forwardAction()
        if (!targetData) {
          loadingFinish()
          return
        }
        if (Array.isArray(targetData)) {
          targetData.forEach((e: HistoryItemType) => {
            this.setBackAndSetForwardHandle(e, true)
          })
          loadingFinish()
          return
        }
        this.setBackAndSetForwardHandle(targetData, true)
        loadingFinish()

      } catch(value) {
        loadingError()
      }
    },
    // * 移动位置
    setMove(keyboardValue: MenuEnum) {
      const index  = this.fetchTargetIndex()
      if(index === -1) return
      const attr = this.getComponentList[index].attr
      const distance = settingStore.getChartMoveDistance
      switch (keyboardValue) {
        case MenuEnum.ARROW_UP:
          attr.y -= distance
          break;
        case MenuEnum.ARROW_RIGHT:
          attr.x += distance
          break;
        case MenuEnum.ARROW_DOWN:
          attr.y += distance
          break;
        case MenuEnum.ARROW_LEFT:
          attr.x -= distance
          break;
      }
    }, 
    // ----------------
    // * 设置页面大小
    setPageSize(scale: number): void {
      this.setPageStyle('height', `${this.editCanvasConfig.height * scale}px`)
      this.setPageStyle('width', `${this.editCanvasConfig.width * scale}px`)
    },
    // * 计算缩放
    computedScale() {
      if (this.getEditCanvas.editLayoutDom) {
        // 现有展示区域
        const width =
          this.getEditCanvas.editLayoutDom.clientWidth - this.getEditCanvas.offset * 2 - 5
        const height =
          this.getEditCanvas.editLayoutDom.clientHeight - this.getEditCanvas.offset * 4

        // 用户设定大小
        const editCanvasWidth = this.editCanvasConfig.width
        const editCanvasHeight = this.editCanvasConfig.height

        // 需保持的比例
        const baseProportion = parseFloat(
          (editCanvasWidth / editCanvasHeight).toFixed(5)
        )
        const currentRate = parseFloat((width / height).toFixed(5))

        if (currentRate > baseProportion) {
          // 表示更宽
          const scaleWidth = parseFloat(
            ((height * baseProportion) / editCanvasWidth).toFixed(5)
          )
          this.setScale( scaleWidth > 1 ? 1 : scaleWidth)
        } else {
          // 表示更高
          const scaleHeight = parseFloat(
            (width / baseProportion / editCanvasHeight).toFixed(5)
          )
          this.setScale(scaleHeight > 1 ? 1 : scaleHeight)
        }
      } else {
        window['$message'].warning('请先创建画布，再进行缩放')
      }
    },
    // * 监听缩放
    listenerScale(): Function {
      const resize = debounce(this.computedScale, 200)
      // 默认执行一次
      resize()
      // 开始监听
      window.addEventListener('resize', resize)
      // 销毁函数
      const remove = () => {
        window.removeEventListener('resize', resize)
      }
      return remove
    },
    /**
     * * 设置缩放
     * @param scale 0~1 number 缩放比例;
     * @param force boolean 强制缩放
     */
    setScale(scale: number, force = false): void {
      if (!this.getEditCanvas.lockScale || force) {
        this.setPageSize(scale)
        this.getEditCanvas.userScale = scale
        this.getEditCanvas.scale = scale
      }
    }
  }
})