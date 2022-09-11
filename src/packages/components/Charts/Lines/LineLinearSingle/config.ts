import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { LineLinearSingleConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import { defaultTheme, chartColorsSearch } from '@/settings/chartThemes/index'
import dataJson from './data.json'

export const includes = ['legend', 'xAxis', 'yAxis']

export const option = {
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
      lineStyle: {
        type: 'solid',
        width: 3,
        color: {
          type: 'linear',
          colorStops: [
            {
              offset: 0,
              color: chartColorsSearch[defaultTheme][0] // 0% 处的颜色
            },
            {
              offset: 1,
              color: chartColorsSearch[defaultTheme][1] // 100% 处的颜色
            }
          ],
          globalCoord: false // 缺省为 false
        },
        shadowColor: chartColorsSearch[defaultTheme][2],
        shadowBlur: 10,
        shadowOffsetY: 20
      }
    }
  ]
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = LineLinearSingleConfig.key
  public chartConfig = LineLinearSingleConfig
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
}
