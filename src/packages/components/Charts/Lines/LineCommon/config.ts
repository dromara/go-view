import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { LineCommonConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import { defaultTheme, chartColorsSearch } from '@/settings/chartThemes/index'
import dataJson from './data.json'

export const includes = ['legend', 'xAxis', 'yAxis']

export const seriesItem = {
  type: 'line',
  lineStyle: {
    type: 'solid',
    width: 3,
    itemStyle: {
      color: null,
      borderRadius: 0
    }
  }
}

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
  series: [seriesItem, seriesItem]
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = LineCommonConfig.key
  public chartConfig = LineCommonConfig
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
}
