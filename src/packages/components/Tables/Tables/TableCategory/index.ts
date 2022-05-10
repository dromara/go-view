import image from '@/assets/images/chart/tables/tables_categary.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const TableCategoryConfig: ConfigType = {
  key: 'TableCategory',
  chartKey: 'VTableCategory',
  conKey: 'VCableCategory',
  title: '归类表格',
  category: ChatCategoryEnum.TABLE,
  categoryName: ChatCategoryEnumName.TABLE,
  package: PackagesCategoryEnum.TABLES,
  image
}
