import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border03Config: ConfigType = {
  key: 'Border03',
  chartKey: 'VBorder03',
  conKey: 'VCBorder03',
  title: '边框-03',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image: 'border03.png'
}
