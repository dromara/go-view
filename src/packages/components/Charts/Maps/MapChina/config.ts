import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { MapChinaConfig } from './index'
import { chartInitConfig } from '@/settings/designSetting'
import { CreateComponentType } from '@/packages/index.d'
import dataJson from './data.json'

export const includes = []

export const option = {
  dataset: dataJson,
  tooltip: {
    show: true,
    trigger: 'item'
  },
  geo: {
    show: false,
    type: 'map',
    roam: false,
    map: 'china'
  },
  series: [
    {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      symbolSize: 6,
      zlevel: 1,
      label: {
        show: false
      },
      itemStyle: {
        shadowBlur: 10,
        color: '#00ECC8'
      },
      data: []
    },
    {
      name: '地图',
      type: 'map',
      map: 'china',
      zoom: 1, //缩放
      itemStyle: {
        // 背景色
        areaColor: 'rgba(117, 236, 170, 0.3)',
        emphasis: {
          areaColor: 'rgba(117, 236, 170, .8)',
          borderWidth: 1,
          shadowBlur: 10,
          shadowColor: '#75ecaa'
        },
        color: '#ffffff',
        borderColor: '#75ecaa',
        borderWidth: 1,
        showHainanIsLands: true // 是否显示南海群岛
      },
      label: {
        show: true,
        color: '#ffffff'
      },
      data: []
    }
  ]
}
export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = MapChinaConfig.key
  public attr = { ...chartInitConfig, w: 750, h: 800, zIndex: -1 }
  public chartConfig = MapChinaConfig
  public option = echartOptionProfixHandle(option, includes)
}
