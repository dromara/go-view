import image from '@/assets/images/chart/informations/title_main.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'

export const TitleProConfig: ConfigType = {
  key: 'TitlePro',
  chartKey: 'VTitlePro',
  conKey: 'VCTitlePro',
  title: '中心标题',
  category: ChatCategoryEnum.TITLE,
  categoryName: ChatCategoryEnumName.TITLE,
  package: PackagesCategoryEnum.INFORMATIONS,
  image
}
