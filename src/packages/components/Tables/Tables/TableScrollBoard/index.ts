import image from '@/assets/images/chart/tables/table_scrollboard.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const TableScrollBoardConfig: ConfigType = {
  key: 'TableScrollBoard',
  chartKey: 'VTableScrollBoard',
  conKey: 'VCTableScrollBoard',
  title: '轮播列表',
  category: ChatCategoryEnum.TABLE,
  categoryName: ChatCategoryEnumName.TABLE,
  package: PackagesCategoryEnum.TABLES,
  image
}
