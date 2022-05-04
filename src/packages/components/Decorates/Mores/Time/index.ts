import image from '@/assets/images/chart/decorates/time.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'

export const TimeConfig: ConfigType = {
  key: 'Time',
  chartKey: 'VTime',
  conKey: 'VCTime',
  title: '时间',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.DECORATES,
  image
}
