import { toRaw } from 'vue'
import { DragKeyEnum, MouseEventButton, WinKeyboard, MacKeyboard } from '@/enums/editPageEnum'
import { createComponent } from '@/packages'
import { ConfigType } from '@/packages/index.d'
import { CreateComponentType, CreateComponentGroupType, PickCreateComponentType } from '@/packages/index.d'
import { useContextMenu } from '@/views/chart/hooks/useContextMenu.hook'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditCanvasTypeEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { loadingStart, loadingFinish, loadingError } from '@/utils'
import { throttle, cloneDeep } from 'lodash'

const chartEditStore = useChartEditStore()
const { onClickOutSide } = useContextMenu()

// * 拖拽到编辑区域里
export const dragHandle = async (e: DragEvent) => {
  e.preventDefault()

  try {
    loadingStart()

    // 获取拖拽数据
    const drayDataString = e!.dataTransfer!.getData(DragKeyEnum.DRAG_KEY)
    if (!drayDataString) {
      loadingFinish()
      return
    }

    // 修改状态
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_CREATE, false)
    const dropData: Exclude<ConfigType, ['image']> = JSON.parse(drayDataString)

    // 创建新图表组件
    let newComponent: CreateComponentType = await createComponent(dropData)

    newComponent.setPosition(e.offsetX - newComponent.attr.w / 2, e.offsetY - newComponent.attr.h / 2)
    chartEditStore.addComponentList(newComponent, false, true)
    chartEditStore.setTargetSelectChart(newComponent.id)
    loadingFinish()
  } catch (error) {
    loadingError()
    window['$message'].warning(`图表正在研发中, 敬请期待...`)
  }
}

// * 进入拖拽区域
export const dragoverHandle = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
}

// * 不拦截默认行为点击
export const mousedownHandleUnStop = (e: MouseEvent, item?: CreateComponentType | CreateComponentGroupType) => {
  if (item) {
    chartEditStore.setTargetSelectChart(item.id)
    return
  }
  chartEditStore.setTargetSelectChart(undefined)
}

// * 框选
export const mousedownBoxSelect = (e: MouseEvent, item?: CreateComponentType | CreateComponentGroupType) => {
  mousedownHandleUnStop(e)

  // 记录点击初始位置
  const startOffsetX = e.offsetX
  const startOffsetY = e.offsetY
  const startScreenX = e.screenX
  const startScreenY = e.screenY

  // 记录缩放
  const scale = chartEditStore.getEditCanvas.scale

  chartEditStore.setMousePosition(undefined, undefined, startOffsetX, startOffsetY)

  // 移动框选
  const mousemove = throttle((moveEvent: MouseEvent) => {
    // 取消当前选中
    chartEditStore.setTargetSelectChart()
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_SELECT, true)

    // 这里先把相对值算好，不然组件无法获取 startScreenX 和 startScreenY 的值
    const currX = startOffsetX + moveEvent.screenX - startScreenX
    const currY = startOffsetY + moveEvent.screenY - startScreenY
    chartEditStore.setMousePosition(currX, currY)

    // 计算框选的左上角和右下角
    const selectAttr = {
      // 左上角
      x1: 0,
      y1: 0,
      // 右下角
      x2: 0,
      y2: 0
    }
    if (currX > startOffsetX && currY > startOffsetY) {
      // 右下方向
      selectAttr.x1 = startOffsetX
      selectAttr.y1 = startOffsetY
      selectAttr.x2 = Math.round(startOffsetX + (moveEvent.screenX - startScreenX) / scale)
      selectAttr.y2 = Math.round(startOffsetY + (moveEvent.screenY - startScreenY) / scale)
    } else if (currX > startOffsetX && currY < startOffsetY) {
      // 右上方向
      selectAttr.x1 = startOffsetX
      selectAttr.y1 = Math.round(startOffsetY - (startScreenY - moveEvent.screenY) / scale)
      selectAttr.x2 = Math.round(startOffsetX + (moveEvent.screenX - startScreenX) / scale)
      selectAttr.y2 = startOffsetY
    } else if (currX < startOffsetX && currY > startOffsetY) {
      selectAttr.x1 = Math.round(startOffsetX - (startScreenX - moveEvent.screenX) / scale)
      selectAttr.y1 = startOffsetY
      selectAttr.x2 = startOffsetX
      selectAttr.y2 = Math.round(startOffsetY + (moveEvent.screenY - startScreenY) / scale)
      // 左下方向
    } else {
      // 左上方向
      selectAttr.x1 = Math.round(startOffsetX - (startScreenX - moveEvent.screenX) / scale)
      selectAttr.y1 = Math.round(startOffsetY - (startScreenY - moveEvent.screenY) / scale)
      selectAttr.x2 = startOffsetX
      selectAttr.y2 = startOffsetY
    }

    // 遍历组件
    chartEditStore.getComponentList.forEach(item => {
      if (!chartEditStore.getTargetChart.selectId.includes(item.id)) {
        // 处理左上角
        let isSelect = false
        const { x, y, w, h } = item.attr
        const targetAttr = {
          // 左上角
          x1: x,
          y1: y,
          // 右下角
          x2: x + w,
          y2: y + h
        }
        // 全包含则选中
        if (
          targetAttr.x1 - selectAttr.x1 >= 0 &&
          targetAttr.y1 - selectAttr.y1 >= 0 &&
          targetAttr.x2 - selectAttr.x2 <= 0 &&
          targetAttr.y2 - selectAttr.y2 <= 0
        ) {
          isSelect = true
          chartEditStore.setTargetSelectChart(item.id, true)
        }
      }
    })
  }, 20)

  // 鼠标抬起
  const mouseup = () => {
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_SELECT, false)
    chartEditStore.setMousePosition(0, 0, 0, 0)
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
  }
  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mouseup', mouseup)
}

// * 鼠标事件
export const useMouseHandle = () => {
  // *  Click 事件, 松开鼠标触发
  const mouseClickHandle = (e: MouseEvent, item: CreateComponentType | CreateComponentGroupType) => {
    e.preventDefault()
    e.stopPropagation()
    // 若此时按下了 CTRL, 表示多选
    if (
      window.$KeyboardActive?.has(WinKeyboard.CTRL_SOURCE_KEY) ||
      window.$KeyboardActive?.has(MacKeyboard.CTRL_SOURCE_KEY)
    ) {
      // 若已选中，则去除
      if (chartEditStore.targetChart.selectId.includes(item.id)) {
        const exList = chartEditStore.targetChart.selectId.filter(e => e !== item.id)
        chartEditStore.setTargetSelectChart(exList)
      } else {
        chartEditStore.setTargetSelectChart(item.id, true)
      }
    }
  }

  // * 按下事件（包含移动事件）
  const mousedownHandle = (e: MouseEvent, item: CreateComponentType | CreateComponentGroupType) => {
    e.preventDefault()
    e.stopPropagation()
    onClickOutSide()
    // 按下左键 + CTRL
    if (
      e.buttons === MouseEventButton.LEFT &&
      (window.$KeyboardActive?.has(WinKeyboard.CTRL_SOURCE_KEY) ||
        window.$KeyboardActive?.has(MacKeyboard.CTRL_SOURCE_KEY))
    )
      return

    // 按下右键 + 选中多个 + 目标元素是多选子元素
    const selectId = chartEditStore.getTargetChart.selectId
    if (e.buttons === MouseEventButton.RIGHT && selectId.length > 1 && selectId.includes(item.id)) return

    // 选中当前目标组件
    chartEditStore.setTargetSelectChart(item.id)

    // 按下右键
    if (e.buttons === MouseEventButton.RIGHT) return

    const scale = chartEditStore.getEditCanvas.scale
    const canvasWidth = chartEditStore.getEditCanvasConfig.width
    const canvasHeight = chartEditStore.getEditCanvasConfig.height

    // 记录图表初始位置和大小
    const targetMap = new Map()
    chartEditStore.getTargetChart.selectId.forEach(id => {
      const index = chartEditStore.fetchTargetIndex(id)
      if (index !== -1) {
        const { x, y, w, h } = toRaw(chartEditStore.getComponentList[index]).attr
        targetMap.set(id, { x, y, w, h })
      }
    })

    // 记录点击初始位置
    const startX = e.screenX
    const startY = e.screenY

    // 记录历史位置
    let prevComponentInstance: Array<CreateComponentType | CreateComponentGroupType> = []
    chartEditStore.getTargetChart.selectId.forEach(id => {
      if (!targetMap.has(id)) return

      const index = chartEditStore.fetchTargetIndex(id)
      // 拿到初始位置数据
      prevComponentInstance.push(cloneDeep(chartEditStore.getComponentList[index]))
    })

    // 记录初始位置
    chartEditStore.setMousePosition(undefined, undefined, startX, startY)

    // 移动-计算偏移量
    const mousemove = throttle((moveEvent: MouseEvent) => {
      chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, true)
      chartEditStore.setMousePosition(moveEvent.screenX, moveEvent.screenY)

      // 当前偏移量，处理 scale 比例问题
      let offsetX = (moveEvent.screenX - startX) / scale
      let offsetY = (moveEvent.screenY - startY) / scale

      chartEditStore.getTargetChart.selectId.forEach(id => {
        if (!targetMap.has(id)) return

        const index = chartEditStore.fetchTargetIndex(id)
        // 拿到初始位置数据
        const { x, y, w, h } = targetMap.get(id)
        const componentInstance = chartEditStore.getComponentList[index]

        let currX = Math.round(x + offsetX)
        let currY = Math.round(y + offsetY)

        // 要预留的距离
        const distance = 50

        // 基于左上角位置检测
        currX = currX < -w + distance ? -w + distance : currX
        currY = currY < -h + distance ? -h + distance : currY

        // 基于右下角位置检测
        currX = currX > canvasWidth - distance ? canvasWidth - distance : currX
        currY = currY > canvasHeight - distance ? canvasHeight - distance : currY

        componentInstance.attr = Object.assign(componentInstance.attr, {
          x: currX,
          y: currY
        })
      })
      return
    }, 20)

    const mouseup = () => {
      chartEditStore.setMousePosition(0, 0, 0, 0)
      chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, false)
      // 加入历史栈
      if (prevComponentInstance.length) {
        chartEditStore.getTargetChart.selectId.forEach(id => {
          if (!targetMap.has(id)) return
          const index = chartEditStore.fetchTargetIndex(id)
          const curComponentInstance = chartEditStore.getComponentList[index]
          // 找到记录的所选组件
          prevComponentInstance.forEach(preItem => {
            if (preItem.id === id) {
              preItem.attr = Object.assign(preItem.attr, {
                offsetX: curComponentInstance.attr.x - preItem.attr.x,
                offsetY: curComponentInstance.attr.y - preItem.attr.y
              })
            }
          })
        })
        chartEditStore.moveComponentList(prevComponentInstance)
      }
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
    }

    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
  }

  // * 进入事件
  const mouseenterHandle = (e: MouseEvent, item: CreateComponentType | CreateComponentGroupType) => {
    e.preventDefault()
    e.stopPropagation()
    if (!chartEditStore.getEditCanvas.isSelect) {
      chartEditStore.setTargetHoverChart(item.id)
    }
  }

  // * 移出事件
  const mouseleaveHandle = (e: MouseEvent, item: CreateComponentType | CreateComponentGroupType) => {
    e.preventDefault()
    e.stopPropagation()
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, false)
    chartEditStore.setTargetHoverChart(undefined)
  }

  return { mouseClickHandle, mousedownHandle, mouseenterHandle, mouseleaveHandle }
}

// * 移动锚点
export const useMousePointHandle = (e: MouseEvent, point: string, attr: PickCreateComponentType<'attr'>) => {
  e.stopPropagation()
  e.preventDefault()

  // 设置拖拽状态
  chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, true)
  const scale = chartEditStore.getEditCanvas.scale

  const itemAttrX = attr.x
  const itemAttrY = attr.y
  const itemAttrW = attr.w
  const itemAttrH = attr.h

  // 记录点击初始位置
  const startX = e.screenX
  const startY = e.screenY

  // 记录初始位置
  chartEditStore.setMousePosition(startX, startY)

  const mousemove = throttle((moveEvent: MouseEvent) => {
    chartEditStore.setMousePosition(moveEvent.screenX, moveEvent.screenY)

    let currX = Math.round((moveEvent.screenX - startX) / scale)
    let currY = Math.round((moveEvent.screenY - startY) / scale)

    const isTop = /t/.test(point)
    const isBottom = /b/.test(point)
    const isLeft = /l/.test(point)
    const isRight = /r/.test(point)

    const newHeight = itemAttrH + (isTop ? -currY : isBottom ? currY : 0)
    const newWidth = itemAttrW + (isLeft ? -currX : isRight ? currX : 0)

    attr.h = newHeight > 0 ? newHeight : 0
    attr.w = newWidth > 0 ? newWidth : 0
    attr.x = itemAttrX + (isLeft ? currX : 0)
    attr.y = itemAttrY + (isTop ? currY : 0)
  }, 50)

  const mouseup = () => {
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, false)
    chartEditStore.setMousePosition(0, 0, 0, 0)
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
  }

  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mouseup', mouseup)
}
