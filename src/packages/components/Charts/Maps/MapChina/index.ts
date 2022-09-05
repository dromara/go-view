import image from '@/assets/images/chart/charts/map.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const MapChinaConfig: ConfigType = {
  key: 'MapChina',
  chartKey: 'VMapChina',
  conKey: 'VCMapChina',
  title: '地图',
  category: ChatCategoryEnum.MAP,
  categoryName: ChatCategoryEnumName.MAP,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image
}
