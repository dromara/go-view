import image from '@/assets/images/chart/decorates/weather_time.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'

export const WeatherTimeConfig: ConfigType = {
  key: 'WeatherTime',
  chartKey: 'VWeatherTime',
  conKey: 'VCWeatherTime',
  title: '天气和时间',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.DECORATES,
  image
}
