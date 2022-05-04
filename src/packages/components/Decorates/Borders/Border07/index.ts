import image from '@/assets/images/chart/decorates/border07.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border07Config: ConfigType = {
  key: 'Border07',
  chartKey: 'VBorder07',
  conKey: 'VCBorder07',
  title: '边框-07',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image
}
