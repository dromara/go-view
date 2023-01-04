import image from '@/assets/images/chart/charts/tree_map.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const TreeMapConfig: ConfigType = {
  key: 'TreeMap',
  chartKey: 'VTreeMap',
  conKey: 'VCTreeMap',
  title: '树形分布',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image
}
