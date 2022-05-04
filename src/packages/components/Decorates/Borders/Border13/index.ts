import image from '@/assets/images/chart/decorates/border13.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border13Config: ConfigType = {
  key: 'Border13',
  chartKey: 'VBorder13',
  conKey: 'VCBorder13',
  title: '边框-13',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image
}
