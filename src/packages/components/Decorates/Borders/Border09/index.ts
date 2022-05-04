import image from '@/assets/images/chart/decorates/border09.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border09Config: ConfigType = {
  key: 'Border09',
  chartKey: 'VBorder09',
  conKey: 'VCBorder09',
  title: '边框-09',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image
}
