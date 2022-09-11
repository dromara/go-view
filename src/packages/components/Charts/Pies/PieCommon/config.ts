import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { PieCommonConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import dataJson from './data.json'

export const includes = ['legend']

const option = {
  tooltip: {
    show: true,
    trigger: 'item'
  },
  legend: {
    show: true,
  },
  dataset: { ...dataJson },
  series: [
    {
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: {
        show: true,
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '40',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      }
    }
  ]
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = PieCommonConfig.key

  public chartConfig = PieCommonConfig

  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
}
