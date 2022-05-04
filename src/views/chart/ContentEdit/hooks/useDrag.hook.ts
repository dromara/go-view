import { DragKeyEnum } from '@/enums/editPageEnum'
import { createComponent } from '@/packages'
import { ConfigType } from '@/packages/index.d'
import {
  CreateComponentType,
  PickCreateComponentType,
} from '@/packages/index.d'
import { useContextMenu } from '@/views/chart/hooks/useContextMenu.hook'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditCanvasTypeEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { loadingStart, loadingFinish, loadingError } from '@/utils'
import throttle from 'lodash/throttle'

const chartEditStore = useChartEditStore()
const { onClickOutSide } = useContextMenu()

// * 拖拽到编辑区域里
export const dragHandle = async (e: DragEvent) => {
  e.preventDefault()

  try {
    loadingStart()

    // 获取拖拽数据
    const drayDataString = e!.dataTransfer!.getData(DragKeyEnum.DROG_KEY)
    if (!drayDataString) {
      loadingFinish()
      return
    }

    // 修改状态
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_CREATE, false)
    const dropData: Exclude<ConfigType, ['image']> = JSON.parse(drayDataString)

    // 创建新图表组件
    let newComponent: CreateComponentType = await createComponent(dropData)

    newComponent.setPosition(
      e.offsetX - newComponent.attr.w / 2,
      e.offsetY - newComponent.attr.h / 2
    )
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
export const mousedownHandleUnStop = (
  e: MouseEvent,
  item?: CreateComponentType
) => {
  if (item) {
    chartEditStore.setTargetSelectChart(item.id)
    return
  }
  chartEditStore.setTargetSelectChart(undefined)
}

// * 移动图表
export const useMouseHandle = () => {
  // 点击事件（包含移动事件）
  const mousedownHandle = (e: MouseEvent, item: CreateComponentType) => {
    e.preventDefault()
    e.stopPropagation()

    onClickOutSide()
    chartEditStore.setTargetSelectChart(item.id)
    const scale = chartEditStore.getEditCanvas.scale
    const width = chartEditStore.getEditCanvasConfig.width
    const height = chartEditStore.getEditCanvasConfig.height

    // 记录图表初始位置和大小
    const itemAttrX = item.attr.x
    const itemAttrY = item.attr.y
    const itemAttrW = item.attr.w
    const itemAttrH = item.attr.h

    // 记录点击初始位置
    const startX = e.screenX
    const startY = e.screenY
    // 记录初始位置
    chartEditStore.setMousePosition(startX, startY)

    // 计算偏移量（处理 scale 比例问题）
    const mousemove = throttle((moveEvent: MouseEvent) => {
      chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, true)
      chartEditStore.setMousePosition(moveEvent.screenX, moveEvent.screenY)

      let currX = Math.round(itemAttrX + (moveEvent.screenX - startX) / scale)
      let currY = Math.round(itemAttrY + (moveEvent.screenY - startY) / scale)

      // 要预留的距离
      const distance = 50
      // 基于左上角位置检测
      currX = currX < -itemAttrW + distance ? -itemAttrW + distance : currX
      currY = currY < -itemAttrH + distance ? -itemAttrH + distance : currY

      // 基于右下角位置检测
      currX = currX > width - distance ? width - distance : currX
      currY = currY > height - distance ? height - distance : currY

      item.attr.x = currX
      item.attr.y = currY
    }, 30)

    const mouseup = () => {
      chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, false)
      chartEditStore.setMousePosition(0, 0)
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
    }

    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
  }

  // * 进入事件
  const mouseenterHandle = (e: MouseEvent, item: CreateComponentType) => {
    e.preventDefault()
    e.stopPropagation()
    chartEditStore.setTargetHoverChart(item.id)
  }

  // * 移出事件
  const mouseleaveHandle = (e: MouseEvent, item: CreateComponentType) => {
    e.preventDefault()
    e.stopPropagation()
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, false)
    chartEditStore.setTargetHoverChart(undefined)
  }

  return { mousedownHandle, mouseenterHandle, mouseleaveHandle }
}

// * 移动锚点
export const useMousePointHandle = (
  e: MouseEvent,
  point: string,
  attr: PickCreateComponentType<'attr'>
) => {
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
    chartEditStore.setMousePosition(0, 0)
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
  }

  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mouseup', mouseup)
}
