import { publicConfig } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { Border12Config } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  colors: ['#2862b7', '#2862b7'],
  backgroundColor: '#00000000'
}

export default class Config extends publicConfig implements CreateComponentType {
  public key = Border12Config.key
  public chartConfig = cloneDeep(Border12Config)
  public option = cloneDeep(option)
}
