import image from '@/assets/images/chart/decorates/border08.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border08Config: ConfigType = {
  key: 'Border08',
  chartKey: 'VBorder08',
  conKey: 'VCBorder08',
  title: '边框-08',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image
}
