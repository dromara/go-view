import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { Decorates03Config } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  textColor: '#fff',
  textSize: 24,
  colors: ['#1dc1f5', '#1dc1f5'],
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Decorates03Config.key
  public chartConfig = cloneDeep(Decorates03Config)
  public option = cloneDeep(option)
}
