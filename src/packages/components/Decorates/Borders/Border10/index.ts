import image from '@/assets/images/chart/decorates/border10.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border10Config: ConfigType = {
  key: 'Border10',
  chartKey: 'VBorder10',
  conKey: 'VCBorder10',
  title: '边框-10',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image
}
