import Color from 'color'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { PickCreateComponentType } from '@/packages/index.d'
import { EditCanvasConfigType } from '@/store/modules/chartEditStore/chartEditStore.d'

type AttrType = PickCreateComponentType<'attr'>
type StylesType = PickCreateComponentType<'styles'>

// * 动画
export const animationsClass = (animations: string[]) => {
  if (animations.length) {
    return `animate__animated  animate__${animations[0]}`
  }
  return ''
}

// * 滤镜
export const getFilterStyle = (styles?: StylesType | EditCanvasConfigType) => {
  if (!styles || !styles.filterShow) return {}
  const { opacity, saturate, contrast, hueRotate, brightness } = styles
  return {
    opacity: opacity,
    filter: `saturate(${saturate}) contrast(${contrast}) hue-rotate(${hueRotate}deg) brightness(${brightness})`
  }
}

// * 变换
export const getTransformStyle = (styles: StylesType) => {
  const { rotateZ, rotateX, rotateY, skewX, skewY } = styles
  return {
    transform: `rotateZ(${rotateZ || 0}deg) rotateX(${rotateX || 0}deg) rotateY(${rotateY || 0}deg) skewX(${
      skewX || 0
    }deg) skewY(${skewY || 0}deg)`
  }
}

// * 混合模式
export const getBlendModeStyle = (styles: StylesType) => {
  if (!styles || !styles.filterShow) return {}
  const { blendMode } = styles
  return {
    'mix-blend-mode': blendMode
  }
}

/**
 * * hsla 转换
 * @param color 颜色
 * @param alpha 默认1
 * @returns
 */
export function alpha(color: string, alpha = 1) {
  return Color(color).alpha(alpha).toString()
}

/**
 * * 颜色透明
 * rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 0.4)
 * @param color 颜色
 * @param concentration 0~1 浓度
 * @returns
 */
export function fade(color: string, fade: number) {
  return Color(color).fade(fade).toString()
}

/**
 * * 颜色变亮
 * hsl(100, 50%, 10%) -> hsl(100, 50%, 50%)
 * @param color 颜色
 * @param concentration 0~1 浓度
 * @returns
 */
export function lighten(color: string, concentration: number) {
  return Color(color).lighten(concentration).toString()
}

/**
 * * 颜色变暗
 * hsl(100, 50%, 50%) -> hsl(100, 50%, 25%)
 * @param color 颜色
 * @param concentration 0~1 浓度
 * @returns
 */
export function darken(color: string, concentration: number) {
  return Color(color).darken(concentration).toString()
}

/**
 * * 修改主题色
 * @param themeName 主题名称
 * @returns
 */
export const setHtmlTheme = (themeName?: string) => {
  const e = window.document.documentElement
  if (themeName) {
    e.setAttribute('data-theme', themeName)
    return
  }
  const designStore = useDesignStore()
  e.setAttribute('data-theme', designStore.themeName)
}
