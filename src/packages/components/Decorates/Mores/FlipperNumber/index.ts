import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const FlipperNumberConfig: ConfigType = {
  key: 'FlipperNumber',
  chartKey: 'VFlipperNumber',
  conKey: 'VCFlipperNumber',
  title: '数字翻牌-需动态触发',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.DECORATES,
  image: 'flipper-number.png'
}
