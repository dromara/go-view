import { PickCreateComponentType } from '@/packages/index.d'
import { EditCanvasConfigType } from '@/store/modules/chartEditStore/chartEditStore.d'

type AttrType = PickCreateComponentType<'attr'>
type StylesType = PickCreateComponentType<'styles'>

// 设置位置
export const getComponentAttrStyle = (attr: AttrType, index: number) => {
  const componentStyle = {
    zIndex: index + 1,
    left: `${attr.x}px`,
    top: `${attr.y}px`
  }
  return componentStyle
}

// 设置大小
export const getSizeStyle = (attr: AttrType, scale?: number) => {
  return ({
    width: `${scale ? scale * attr.w : attr.w}px`,
    height: `${scale ? scale * attr.h : attr.h}px`
  })
}

// 全局样式
export const getEditCanvasConfigStyle = (canvas: EditCanvasConfigType) => {
  // 背景
  const computedBackground = canvas.selectColor
    ? { background: canvas.background }
    : {
        background: `url(${canvas.backgroundImage}) center center / cover no-repeat !important`
      }
  return {
    position: 'relative' as const,
    width: canvas.width ? `${canvas.width || 100}px` : '100%',
    height: canvas.height ? `${canvas.height}px` : '100%',
    ...computedBackground
  }
}
