import { publicConfig } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { Decorates02Config } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  colors: ['#ffffff4d', '#ffffff4d'],
  dur: 3,
  lineHeight: 3
}

export default class Config extends publicConfig implements CreateComponentType {
  public key = Decorates02Config.key
  public chartConfig = cloneDeep(Decorates02Config)
  public option = cloneDeep(option)
}
