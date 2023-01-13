import type { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import type { RequestConfigType } from '@/store/modules/chartEditStore/chartEditStore.d'

export enum ChartFrameEnum {
  // 支持 dataset 的 echarts 框架
  ECHARTS = 'echarts',
  // UI 组件框架
  NAIVE_UI = 'naiveUI',
  // 自定义带数据组件
  COMMON = 'common',
  // 无数据变更
  STATIC = 'static'
}

// 组件配置
export type ConfigType = {
  key: string
  chartKey: string
  conKey: string
  title: string
  category: string
  categoryName: string
  package: string
  chartFrame?: ChartFrameEnum
  image: string
}

// 数据请求
interface requestConfig {
  request: RequestConfigType
}

// Echarts 数据类型
interface EchartsDataType {
  dimensions: string[]
  source: any[]
}

// 组件状态
export interface StatusType {
  lock: boolean
  hide: boolean
}

// 滤镜/变换枚举
export enum FilterEnum {
  // 是否启用
  FILTERS_SHOW = 'filterShow',

  // 透明度
  OPACITY = 'opacity',
  // 饱和度
  SATURATE = 'saturate',
  // 对比度
  CONTRAST = 'contrast',
  // 色相
  HUE_ROTATE = 'hueRotate',
  // 亮度
  BRIGHTNESS = 'brightness',

  // 旋转
  ROTATE_Z = 'rotateZ',
  ROTATE_X = 'rotateX',
  ROTATE_Y = 'rotateY',

  // 倾斜
  SKEW_X = 'skewX',
  SKEW_Y = 'skewY',

  // 混合模式
  BLEND_MODE = 'blendMode'
}

export const BlendModeEnumList = [
  { label: '正常', value: 'normal' },
  { label: '正片叠底', value: 'multiply' },
  { label: '叠加', value: 'overlay' },
  { label: '滤色', value: 'screen' },
  { label: '变暗', value: 'darken' },
  { label: '变亮', value: 'lighten' },
  { label: '颜色减淡', value: 'color-dodge' },
  { label: '颜色加深', value: 'color-burn;' },
  { label: '强光', value: 'hard-light' },
  { label: '柔光', value: 'soft-light' },
  { label: '差值', value: 'difference' },
  { label: '排除', value: 'exclusion' },
  { label: '色相', value: 'hue' },
  { label: '饱和度', value: 'saturation' },
  { label: '颜色', value: 'color' },
  { label: '亮度', value: 'luminosity' }
]

// 基础事件类型(vue不加 on)
export enum BaseEvent {
  // 点击
  ON_CLICK = 'click',
  // 双击
  ON_DBL_CLICK = 'dblclick',
  // 移入
  ON_MOUSE_ENTER = 'mouseenter',
  // 移出
  ON_MOUSE_LEAVE = 'mouseleave',
}

// vue3 生命周期事件
export enum EventLife { 
  // 渲染之后
  VNODE_MOUNTED = 'vnodeMounted',
  // 渲染之前
  VNODE_BEFORE_MOUNT = 'vnodeBeforeMount',
}

// 组件实例类
export interface PublicConfigType {
  id: string
  isGroup: boolean
  attr: { x: number; y: number; w: number; h: number; zIndex: number; offsetX: number; offsetY: number }
  styles: {
    [FilterEnum.FILTERS_SHOW]: boolean
    [FilterEnum.OPACITY]: number
    [FilterEnum.SATURATE]: number
    [FilterEnum.CONTRAST]: number
    [FilterEnum.HUE_ROTATE]: number
    [FilterEnum.BRIGHTNESS]: number

    [FilterEnum.ROTATE_Z]: number
    [FilterEnum.ROTATE_X]: number
    [FilterEnum.ROTATE_Y]: number

    [FilterEnum.SKEW_X]: number
    [FilterEnum.SKEW_Y]: number
    [FilterEnum.BLEND_MODE]: string
    // 动画
    animations: string[]
  }
  filter?: string
  status: StatusType
  events: {
    baseEvent: {
      [K in BaseEvent]?: string
    },
    advancedEvents: {
      [K in EventLife]?: string
    }
  }
}

export interface CreateComponentType extends PublicConfigType, requestConfig {
  key: string
  chartConfig: ConfigType
  option: GlobalThemeJsonType,
}

// 组件成组实例类
export interface CreateComponentGroupType extends CreateComponentType {
  groupList: Array<CreateComponentType>
}

// 获取组件实例类中某个key对应value类型的方法
export type PickCreateComponentType<T extends keyof CreateComponentType> = Pick<CreateComponentType, T>[T]

// 包分类枚举
export enum PackagesCategoryEnum {
  CHARTS = 'Charts',
  TABLES = 'Tables',
  INFORMATIONS = 'Informations',
  DECORATES = 'Decorates'
}

// 包分类名称
export enum PackagesCategoryName {
  CHARTS = '图表',
  TABLES = '列表',
  INFORMATIONS = '信息',
  DECORATES = '小组件'
}

// 获取组件
export enum FetchComFlagType {
  VIEW,
  CONFIG
}

// 图表包类型
export type PackagesType = {
  [PackagesCategoryEnum.CHARTS]: ConfigType[]
  [PackagesCategoryEnum.INFORMATIONS]: ConfigType[]
  [PackagesCategoryEnum.TABLES]: ConfigType[]
  [PackagesCategoryEnum.DECORATES]: ConfigType[]
}
