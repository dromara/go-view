import image from '@/assets/images/chart/charts/bar_y.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const BarCrossrangeConfig: ConfigType = {
  key: 'BarCrossrange',
  chartKey: 'VBarCrossrange',
  conKey: 'VCBarCrossrange',
  title: '横向柱状图',
  category: ChatCategoryEnum.BAR,
  categoryName: ChatCategoryEnumName.BAR,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image
}
