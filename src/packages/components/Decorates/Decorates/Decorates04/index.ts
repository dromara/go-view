import image from '@/assets/images/chart/decorates/decorates04.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Decorates04Config: ConfigType = {
  key: 'Decorates04',
  chartKey: 'VDecorates04',
  conKey: 'VCDecorates04',
  title: '装饰-04',
  category: ChatCategoryEnum.DECORATE,
  categoryName: ChatCategoryEnumName.DECORATE,
  package: PackagesCategoryEnum.DECORATES,
  image
}
