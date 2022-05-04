import image from '@/assets/images/chart/decorates/border05.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border05Config: ConfigType = {
  key: 'Border05',
  chartKey: 'VBorder05',
  conKey: 'VCBorder05',
  title: '边框-05',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image
}
