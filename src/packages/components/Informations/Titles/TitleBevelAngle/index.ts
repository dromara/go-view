import image from '@/assets/images/chart/informations/title_diamond2.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'

export const TitleBevelAngleConfig: ConfigType = {
  key: 'TitleBevelAngle',
  chartKey: 'VTitleBevelAngle',
  conKey: 'VCTitleBevelAngle',
  title: '斜角标题',
  category: ChatCategoryEnum.TITLE,
  categoryName: ChatCategoryEnumName.TITLE,
  package: PackagesCategoryEnum.INFORMATIONS,
  image
}
