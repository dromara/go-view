import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border04Config: ConfigType = {
  key: 'Border04',
  chartKey: 'VBorder04',
  conKey: 'VCBorder04',
  title: '边框-04',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image: 'border04.png'
}
