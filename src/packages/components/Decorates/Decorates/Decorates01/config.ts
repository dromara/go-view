import { publicConfig } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { Decorates01Config } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  colors: ['#3faacb', '#fff'],
  dur: 3,
  lineHeight: 2,
  endWidth: 5
}

export default class Config extends publicConfig implements CreateComponentType {
  public key = Decorates01Config.key
  public chartConfig = cloneDeep(Decorates01Config)
  public option = cloneDeep(option)
}
