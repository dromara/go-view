import { getUUID } from '@/utils'
import { ChartFrameEnum, PublicConfigType, CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'
import { RequestConfigType } from '@/store/modules/chartEditStore/chartEditStore.d'
import { groupTitle } from '@/settings/designSetting'
import {
  RequestHttpEnum,
  RequestDataTypeEnum,
  RequestHttpIntervalEnum,
  RequestContentTypeEnum,
  RequestBodyEnum
} from '@/enums/httpEnum'
import { chartInitConfig } from '@/settings/designSetting'

// 请求基础属性
const requestConfig: RequestConfigType = {
  requestDataType: RequestDataTypeEnum.STATIC,
  requestHttpType: RequestHttpEnum.GET,
  requestUrl: '',
  requestInterval: undefined,
  requestIntervalUnit: RequestHttpIntervalEnum.SECOND,
  requestContentType: RequestContentTypeEnum.DEFAULT,
  requestParamsBodyType: RequestBodyEnum.NONE,
  requestSQLContent: {
    sql: 'select * from  where'
  },
  requestParams: {
    Body: {
      'form-data': {},
      'x-www-form-urlencoded': {},
      json: '',
      xml: ''
    },
    Header: {},
    Params: {}
  }
}

// 单实例类
export class publicConfig implements PublicConfigType {
  public id = getUUID()
  public isGroup = false
  // 基本信息
  public attr = { ...chartInitConfig, zIndex: -1 }
  // 基本样式
  public styles = {
    // 色相
    hueRotate: 0,
    // 饱和度
    saturate: 1,
    // 对比度
    contrast: 1,
    // 亮度
    brightness: 1,
    // 透明
    opacity: 1,

    // 旋转
    rotateZ: 0,
    rotateX: 0,
    rotateY: 0,

    // 倾斜
    skewX: 0,
    skewY: 0,

    // 动画
    animations: []
  }
  // 请求
  public request = { ...requestConfig }
  // 数据过滤
  public filter = undefined

  // 设置坐标
  public setPosition(x: number, y: number): void {
    this.attr.x = x
    this.attr.y = y
  }
}

// 成组类 (部分属性不需要, 不继承 publicConfig)
export class PublicGroupConfigClass extends publicConfig implements CreateComponentGroupType {
  // 成组
  public isGroup = true
  // 名称
  public chartConfig = {
    key: 'group',
    chartKey: 'group',
    conKey: 'group',
    category: 'group',
    categoryName: 'group',
    package: 'group',
    chartFrame: ChartFrameEnum.COMMON,
    title: groupTitle,
    image: ''
  }
  // 组成员列表
  public groupList: Array<CreateComponentType> = []
  // ---- 原有 ---
  // key
  public key = 'group'
  // 配置
  public option = {}
  // 标识
  public id = getUUID()
  // 基本信息
  public attr = { w: 0, h: 0, x: 0, y: 0, offsetX: 0, offsetY: 0, zIndex: -1 }
}
