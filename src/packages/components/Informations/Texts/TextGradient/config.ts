import { publicConfig } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { TextGradientConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  dataset: '我是渐变文本',
  size: 20,
  gradient: {
    from: '#0000FFFF',
    to: '#00FF00FF',
    deg: 45
  }
}

export default class Config extends publicConfig implements CreateComponentType {
  public key = TextGradientConfig.key
  public chartConfig = cloneDeep(TextGradientConfig)
  public option = cloneDeep(option)
}
