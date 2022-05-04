import image from '@/assets/images/chart/decorates/decorates02.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'

export const Decorates02Config: ConfigType = {
  key: 'Decorates02',
  chartKey: 'VDecorates02',
  conKey: 'VCDecorates02',
  title: '装饰-02',
  category: ChatCategoryEnum.DECORATE,
  categoryName: ChatCategoryEnumName.DECORATE,
  package: PackagesCategoryEnum.DECORATES,
  image
}
