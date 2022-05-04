import image from '@/assets/images/chart/informations/title_diamond.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'

export const TitleCommonConfig: ConfigType = {
  key: 'TitleCommon',
  chartKey: 'VTitleCommon',
  conKey: 'VCTitleCommon',
  title: '普通标题',
  category: ChatCategoryEnum.TITLE,
  categoryName: ChatCategoryEnumName.TITLE,
  package: PackagesCategoryEnum.INFORMATIONS,
  image
}