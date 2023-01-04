import image from '@/assets/images/chart/decorates/countdown.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const CountDownConfig: ConfigType = {
  key: 'CountDown',
  chartKey: 'VCountDown',
  conKey: 'VCCountDown',
  title: '倒计时',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.DECORATES,
  image
}
