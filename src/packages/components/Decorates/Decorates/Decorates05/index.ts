import image from '@/assets/images/chart/decorates/decorates05.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Decorates05Config: ConfigType = {
  key: 'Decorates05',
  chartKey: 'VDecorates05',
  conKey: 'VCDecorates05',
  title: '装饰-05',
  category: ChatCategoryEnum.DECORATE,
  categoryName: ChatCategoryEnumName.DECORATE,
  package: PackagesCategoryEnum.DECORATES,
  image
}
