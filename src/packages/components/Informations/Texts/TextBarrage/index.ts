import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'

export const TextBarrageConfig: ConfigType = {
  key: 'TextBarrage',
  chartKey: 'VTextBarrage',
  conKey: 'VCTextBarrage',
  title: '弹幕文字',
  category: ChatCategoryEnum.TEXT,
  categoryName: ChatCategoryEnumName.TEXT,
  package: PackagesCategoryEnum.INFORMATIONS,
  image: 'text_barrage.png'
}
