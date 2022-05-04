import { publicConfig } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { NumberConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  from: 50000,
  to: 100000,
  dur: 3,
  showSeparator: true,
  numberSize: 24,
  numberColor: '#4a9ef8',
  prefixText: '￥',
  prefixColor: '#4a9ef8',
  suffixText: '元',
  suffixColor: '#4a9ef8',
}

export default class Config extends publicConfig implements CreateComponentType {
  public key = NumberConfig.key
  public chartConfig = cloneDeep(NumberConfig)
  public option = cloneDeep(option)
}
