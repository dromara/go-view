import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border11Config: ConfigType = {
  key: 'Border11',
  chartKey: 'VBorder11',
  conKey: 'VCBorder11',
  title: '边框-11',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image: 'border11.png'
}
