import { getUUID } from '@/utils'
import { PublicConfigType } from '@/packages/index.d'
import { RequestConfigType } from '@/store/modules/chartEditStore/chartEditStore.d'
import { RequestHttpEnum, RequestDataTypeEnum } from '@/enums/httpEnum'
import { chartInitConfig } from '@/settings/designSetting'

const requestConfig: RequestConfigType = {
  requestDataType: RequestDataTypeEnum.STATIC,
  requestHttpType: RequestHttpEnum.GET
}

export class publicConfig implements PublicConfigType {
  public id = getUUID()
  // 重命名
  public rename = undefined
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
  // 数据
  public data = { ...requestConfig }
  // 数据获取
  public requestData = []

  // 设置坐标
  public setPosition(x: number, y: number): void {
    this.attr.x = x
    this.attr.y = y
  }
}
