import image from '@/assets/images/chart/decorates/border12.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border12Config: ConfigType = {
  key: 'Border12',
  chartKey: 'VBorder12',
  conKey: 'VCBorder12',
  title: '边框-12',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image
}
