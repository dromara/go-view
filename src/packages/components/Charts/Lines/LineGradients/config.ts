import { echartOptionProfixHandle, publicConfig } from '@/packages/public'
import { LineGradientsConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import { graphic } from 'echarts/core'
import { defaultTheme, chartColorsSearch } from '@/settings/chartThemes/index'
import dataJson from './data.json'

export const includes = ['legend', 'xAxis', 'yAxis']

const option = {
  legend: {
    show: true
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'line'
    }
  },
  xAxis: {
    show: true,
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    show: true,
    type: 'value'
  },
  dataset: { ...dataJson },
  series: [
    {
      type: 'line',
      smooth: false,
      lineStyle: {
        width: 3,
        type: 'solid',
      },
      areaStyle: {
        opacity: 0.8,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: chartColorsSearch[defaultTheme][3]
          },
          {
            offset: 1,
            color: 'rgba(0,0,0,0)'
          }
        ])
      },
    },
    {
      type: 'line',
      smooth: false,
      lineStyle: {
        normal: {
          width: 3
        }
      },
      areaStyle: {
        opacity: 0.8,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: chartColorsSearch[defaultTheme][4]
          },
          {
            offset: 1,
            color: 'rgba(0,0,0,0)'
          }
        ])
      },
    }
  ]
}

export default class Config extends publicConfig
  implements CreateComponentType {
  public key: string = LineGradientsConfig.key
  public chartConfig = LineGradientsConfig
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
}
