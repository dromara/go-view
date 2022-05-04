import image from '@/assets/images/chart/Tables/tables.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const TableCommonConfig: ConfigType = {
  key: 'TableCommon',
  chartKey: 'VTableCommon',
  conKey: 'VCTableCommon',
  title: '表格',
  category: ChatCategoryEnum.TABLE,
  categoryName: ChatCategoryEnumName.TABLE,
  package: PackagesCategoryEnum.TABLES,
  image
}
