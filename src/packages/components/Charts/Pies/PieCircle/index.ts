import image from '@/assets/images/chart/charts/pie-circle.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const PieCircleConfig: ConfigType = {
  key: 'PieCircle',
  chartKey: 'VPieCircle',
  conKey: 'VCPieCircle',
  title: '饼图-环形',
  category: ChatCategoryEnum.PIE,
  categoryName: ChatCategoryEnumName.PIE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image
}
