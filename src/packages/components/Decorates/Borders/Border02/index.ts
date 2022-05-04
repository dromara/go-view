import image from '@/assets/images/chart/decorates/border02.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border02Config: ConfigType = {
  key: 'Border02',
  chartKey: 'VBorder02',
  conKey: 'VCBorder02',
  title: '边框-02',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image
}
