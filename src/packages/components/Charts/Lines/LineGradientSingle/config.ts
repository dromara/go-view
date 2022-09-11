import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { LineGradientSingleConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import { graphic } from 'echarts/core'
import { defaultTheme, chartColorsSearch } from '@/settings/chartThemes/index'
import dataJson from './data.json'

export const includes = ['legend', 'xAxis', 'yAxis']

const options = {
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'line'
    }
  },
  legend: {
    show: true
  },
  xAxis: {
    show: true,
    type: 'category'
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
        type: 'solid',
        width: 3
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
      }
    }
  ]
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = LineGradientSingleConfig.key
  public chartConfig = LineGradientSingleConfig
  // 图表配置项
  public option = echartOptionProfixHandle(options, includes)
}
