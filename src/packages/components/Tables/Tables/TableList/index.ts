import image from '@/assets/images/chart/tables/tables_list.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const TableListConfig: ConfigType = {
  key: 'TableList',
  chartKey: 'VTableList',
  conKey: 'VCTableList',
  title: '滚动排名列表',
  category: ChatCategoryEnum.TABLE,
  categoryName: ChatCategoryEnumName.TABLE,
  package: PackagesCategoryEnum.TABLES,
  image
}
