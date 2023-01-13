import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const NumberConfig: ConfigType = {
  key: 'Number',
  chartKey: 'VNumber',
  conKey: 'VCNumber',
  title: '数字计数',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.DECORATES,
  image: 'number.png'
}
