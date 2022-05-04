import image from '@/assets/images/chart/decorates/border01.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border01Config: ConfigType = {
  key: 'Border01',
  chartKey: 'VBorder01',
  conKey: 'VCBorder01',
  title: '边框-01',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image
}
