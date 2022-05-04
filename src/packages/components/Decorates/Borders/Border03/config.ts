import { publicConfig } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { Border03Config } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  colors: ['#6586ec', '#2cf7fe'],
  backgroundColor: '#00000000'
}

export default class Config extends publicConfig implements CreateComponentType {
  public key = Border03Config.key
  public chartConfig = cloneDeep(Border03Config)
  public option = cloneDeep(option)
}
